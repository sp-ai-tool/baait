# BitAhead AI Tools

VS Code extension that provides AI-powered code review tools for your workflow.

## Features

### Automatic Code Review for Staged Changes

This extension automatically reviews your staged git changes using GitHub Copilot. It:
- Reviews all staged files at once
- Provides inline comments and suggestions
- Keeps files open for easy review
- Shows progress as it reviews each file

![Review Staged Changes](https://raw.githubusercontent.com/sp-ai-tool/baait/main/images/review-staged.png)

## Requirements

- VS Code 1.96.0 or higher
- GitHub Copilot extension installed and authenticated
- Git repository

## Usage

1. Stage your changes using git add or VS Code's source control
2. Open Command Palette (Cmd/Ctrl + Shift + P)
3. Run "BitAhead: Review and Comment Staged Changes"
4. Wait for the review to complete

## Extension Settings

Currently no configurable settings.

## Known Issues

- Large files may require longer review times
- Review requires workspace trust

## Release Notes

### 0.0.1

Initial release:
- Added "Review and Comment Staged Changes" command
- Automatic review of all staged files
- Progress indicator during review

## Contributing

Source code available at: [GitHub Repository URL]

## License

MIT
