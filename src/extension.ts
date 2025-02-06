import * as vscode from 'vscode';
import { exec } from 'child_process';

async function getStagedFiles(workspaceRoot: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        exec('git diff --cached --name-only', { cwd: workspaceRoot }, (err: Error | null, stdout: string) => {
            if (err) return reject(err);
            resolve(stdout.trim().split('\n').filter(Boolean));
        });
    });
}

async function reviewFile(uri: vscode.Uri): Promise<void> {
    try {
        const doc = await vscode.workspace.openTextDocument(uri);
        const editor = await vscode.window.showTextDocument(doc, {
            preview: false
        });
        
        const lastLine = doc.lineCount - 1;
        const lastChar = doc.lineAt(lastLine).text.length;
        editor.selection = new vscode.Selection(0, 0, lastLine, lastChar);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await vscode.commands.executeCommand('github.copilot.reviewAndComment');
        const timeout = Math.max(3000, doc.getText().length / 100);
        await new Promise(resolve => setTimeout(resolve, timeout));
    } catch (error) {
        console.error(`Failed to review ${uri.fsPath}:`, error);
    }
}

export function activate(context: vscode.ExtensionContext): void {
    let disposable = vscode.commands.registerCommand('copilot-review-ext.reviewStaged', async () => {
        if (!vscode.workspace.isTrusted) {
            vscode.window.showErrorMessage('Workspace must be trusted to review code');
            return;
        }

        const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspaceRoot) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            const files = await getStagedFiles(workspaceRoot);
            if (!files?.length) {
                vscode.window.showInformationMessage('No staged files found');
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Reviewing staged files",
                cancellable: true
            }, async (progress: vscode.Progress<{ message?: string }>) => {
                for (const file of files) {
                    progress.report({ message: `Reviewing ${file}` });
                    const uri = vscode.Uri.file(`${workspaceRoot}/${file}`);
                    await reviewFile(uri);
                }
            });

            vscode.window.showInformationMessage('Review completed');
        } catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}