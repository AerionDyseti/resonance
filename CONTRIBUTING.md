# Contributing to Resonance

## Project Management with GitHub

We use GitHub Issues as our ticket/task tracking system, similar to Jira. Here's how it works:

### Labels

We use labels to categorize issues:

- **Type Labels**:
  - `feature` - New feature implementation
  - `bug` - Bug fix
  - `testing` - Test implementation
  - `documentation` - Documentation updates
  - `refactor` - Code refactoring

- **Component Labels**:
  - `schema` - Schema system
  - `entity` - Entity management
  - `search` - Search and query
  - `mcp` - MCP server
  - `api` - API endpoints
  - `frontend` - Frontend UI

- **Priority Labels**:
  - `priority:high` - Critical, blocking issues
  - `priority:medium` - Important but not blocking
  - `priority:low` - Nice to have

- **Status Labels**:
  - `status:in-progress` - Currently being worked on
  - `status:blocked` - Blocked by dependencies
  - `status:review` - Ready for review

### Milestones

Milestones represent our development phases:

- **Phase 0**: Project Setup ✅
- **Phase 1**: Database & Core Models (Current)
- **Phase 2**: Schema System
- **Phase 3**: Entity Management
- **Phase 4**: Markdown & Content
- **Phase 5**: Relationships
- **Phase 6**: Search & Query
- **Phase 7**: Campaign System
- **Phase 8**: Timeline System
- **Phase 9**: API Layer
- **Phase 10**: MCP Server
- **Phase 11**: Import/Export
- **Phase 12**: Frontend

### Projects (Kanban Board)

We use GitHub Projects as our Kanban board with these columns:

1. **Blocked** - Issues blocked by dependencies
2. **Ready** - Issues ready to be worked on
3. **In Progress** - Currently being implemented
4. **In Review** - PR created, awaiting review
5. **Done** - Completed and merged

### Issue Templates

We have three issue templates:

1. **Feature Implementation** - For new features or components
2. **Bug Report** - For reporting bugs
3. **Test Implementation** - For implementing tests

### Workflow

1. **Create Issue**: Use appropriate template, add labels and milestone
2. **Add to Project**: Issue starts in "Ready" column
3. **Start Work**:
   - Create branch: `feature/<issue-number>-<brief-description>`
   - Move ticket to "In Progress"
4. **Implement**:
   - Make changes, commit with conventional commits (`feat:`, `fix:`, etc.)
   - Reference issue number in commits: `#<issue-number>`
5. **Create PR**:
   - Push branch and create PR with "Closes #issue-number"
   - Move ticket to "In Review"
6. **Review**: Maintainer reviews and merges
7. **Complete**: Move ticket to "Done", close issue

## Development Setup

### Environment

- Node.js 18+
- TypeScript for type safety

### Code Quality Standards

- **Linting**: ESLint (TypeScript config)
- **Formatting**: Prettier
- **Type checking**: TypeScript strict mode
- **Testing**: Vitest (backend), Vitest/Vue Test Utils (frontend)
- **Test coverage**: Aim for >80%

### Running Locally

```bash
npm install
npm run dev        # Start development servers
npm run build      # Build for production
npm run test       # Run all tests
npm run lint       # Check for linting issues
npm run format     # Format code with Prettier
npm run type-check # Run TypeScript type checking
```

## Pull Request Guidelines

### Before Creating PR

- [ ] All tests passing
- [ ] Code formatted with Prettier (`npm run format`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Documentation updated
- [ ] Tested locally

### PR Description

Include:

- Summary of changes
- Issue reference (Closes #X)
- Testing done
- Screenshots (if UI changes)
- Breaking changes (if any)

### Review Process

- All CI checks must pass
- Resolve all review comments
- Squash commits before merge

## Testing Guidelines

- Aim for >80% code coverage
- Test happy paths AND error cases
- Test edge cases and boundary conditions
- Mock external dependencies

## Questions?

- Check existing issues for similar questions
- Review ROADMAP.md for project direction
- Open a discussion on GitHub Discussions
