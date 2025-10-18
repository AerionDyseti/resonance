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

- **Phase 1**: Foundation (Complete)
- **Phase 2**: Schema System (Current)
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

Use GitHub Projects to create a Kanban board:

1. **To Do** - Issues that are ready to be worked on
2. **In Progress** - Currently being implemented
3. **In Review** - Implementation complete, awaiting review
4. **Done** - Completed and merged

### Issue Templates

We have three issue templates:

1. **Feature Implementation** - For new features or components
2. **Bug Report** - For reporting bugs
3. **Test Implementation** - For implementing tests

### Workflow

1. **Create Issue**: Use appropriate template
2. **Add Labels**: Categorize the issue
3. **Assign Milestone**: Link to development phase
4. **Add to Project**: Place in "To Do" column
5. **Start Work**: Move to "In Progress", add `status:in-progress` label
6. **Create Branch**: `feature/issue-number-brief-description`
7. **Implement**: Make changes, commit with `#issue-number` in message
8. **Test**: Ensure all tests pass
9. **Pull Request**: Reference issue with "Closes #issue-number"
10. **Review**: Move to "In Review"
11. **Merge**: Issue automatically closes, moves to "Done"

## Development Setup

### Prerequisites

- Python 3.11+
- Git

### Setup

```bash
# Clone repository
git clone <repository-url>
cd resonance

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Run tests
pytest
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_schema_builder.py

# Run with coverage
pytest --cov=backend --cov-report=html

# Run tests for specific component
pytest -m schema  # Schema system tests
pytest -m entity  # Entity management tests
```

### Code Style

We use:
- **black** for code formatting
- **ruff** for linting
- **mypy** for type checking

```bash
# Format code
black backend/ shared/ tests/

# Lint
ruff check backend/ shared/ tests/

# Type check
mypy backend/ shared/
```

### Commit Messages

Follow conventional commits:

```
feat: add entity validation
fix: correct relationship cardinality check
test: add schema builder unit tests
docs: update API documentation
refactor: simplify property validation logic
```

Reference issues in commits:
```
feat: implement mixin composition #42
```

## Testing Guidelines

### Test Structure

- **Unit Tests**: `tests/unit/` - Test individual functions/classes
- **Integration Tests**: `tests/integration/` - Test component interactions
- **End-to-End Tests**: `tests/e2e/` - Test complete workflows

### Writing Tests

```python
import pytest
from backend.schema.builder import SchemaBuilder

@pytest.mark.unit
@pytest.mark.schema
def test_create_mixin(db_session, sample_world_id):
    """Test mixin creation with valid properties."""
    builder = SchemaBuilder(db_session)
    # Test implementation
    assert result is not None
```

### Test Coverage

- Aim for >80% code coverage
- Test happy paths AND error cases
- Test edge cases and boundary conditions
- Mock external dependencies

## Pull Request Guidelines

### Before Creating PR

- [ ] All tests passing
- [ ] Code formatted with black
- [ ] No linting errors
- [ ] Type checking passes
- [ ] Documentation updated

### PR Description

Include:
- Summary of changes
- Issue reference (Closes #X)
- Testing done
- Screenshots (if UI changes)
- Breaking changes (if any)

### Review Process

- At least one approval required
- All CI checks must pass
- Resolve all review comments
- Squash commits before merge

## Questions?

- Check existing issues for similar questions
- Review ROADMAP.md for project direction
- Open a discussion on GitHub Discussions
