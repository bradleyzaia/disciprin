# Operator Commands Reference

You have access to operator commands for managing projects, tasks, and system operations. **Always use these commands instead of raw file operations for state-changing actions.**

## Safety Rules

- **Read commands** execute immediately
- **Write commands** validate parameters first
- **Destructive commands** (delete, archive, stop) require user confirmation before executing
- Never bypass operator commands by using raw file tools for operations that have a command equivalent

## Commands

### Tasks (`mc.tasks.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.tasks.list` | List tasks | `project_id?`, `status?`, `limit?` |
| `mc.tasks.create` | Create a task | `title` (required), `description?`, `status?`, `priority?`, `project_id?` |
| `mc.tasks.update` | Update a task | `id` (required), `title?`, `status?`, `priority?`, `description?` |
| `mc.tasks.delete` | ⚠️ Delete a task | `id` (required) — **requires confirmation** |

### Projects (`mc.projects.*` / `os.projects.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.projects.list` | List projects | — |
| `mc.projects.create` | Create a project | `name` (required) |
| `os.projects.list` | List projects (OS level) | — |
| `os.projects.create` | Create project with agent | `name` (required) |
| `os.projects.get` | Get project details | `slug` (required) |
| `os.projects.update` | Update project | `slug` (required), `name?`, `description?` |
| `os.projects.archive` | ⚠️ Archive project | `slug` (required) — **requires confirmation** |
| `os.projects.open` | Open/activate project | `slug` (required) |

### Documents (`mc.documents.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.documents.list` | List documents | `project_id?`, `type?` |
| `mc.documents.create` | Create a document | `title` (required), `content`, `type?`, `project_id?` |
| `mc.documents.get` | Get document content | `id` (required) |
| `mc.documents.update` | Update a document | `id` (required), `title?`, `content?` |

### Labels (`mc.labels.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.labels.list` | List labels | — |
| `mc.labels.create` | Create a label | `name` (required), `color?` |

### Messages (`mc.messages.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.messages.list` | List messages | `project_id?`, `limit?` |
| `mc.messages.create` | Create a message | `content` (required), `project_id?`, `agent_name?` |

### Activities (`mc.activities.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.activities.list` | List activities | `project_id?`, `limit?`, `type?` |
| `mc.activities.log` | Log an activity | `type` (required), `description`, `project_id?` |

### Agents (`mc.agents.*` / `os.agents.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.agents.list` | List registered agents | — |
| `mc.agents.register` | Register/update agent | `name` (required), `type?`, `status?` |
| `mc.agents.heartbeat` | Send agent heartbeat | `agent_id` (required), `status?` |
| `mc.agents.status` | Get agent status | `agent_id?` |
| `os.agents.status` | Get OS-level agent status | `slug` (required) |
| `os.agents.restart` | ⚠️ Restart an agent | `slug` (required) — **requires confirmation** |
| `os.agents.stop` | ⚠️ Stop an agent | `slug` (required) — **requires confirmation** |

### Notifications (`mc.notifications.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.notifications.list` | List notifications | `limit?`, `unread_only?` |
| `mc.notifications.deliver` | Deliver a notification | `title` (required), `body?`, `type?` |
| `mc.notifications.count` | Count notifications | `unread_only?` |

### Subscriptions (`mc.subscriptions.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.subscriptions.list` | List subscriptions | — |
| `mc.subscriptions.subscribe` | Subscribe to events | `event_type` (required), `agent_id?` |
| `mc.subscriptions.unsubscribe` | Unsubscribe | `id` (required) |

### Standup (`mc.standup.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `mc.standup.generate` | Generate standup report | — |
| `mc.standup.preview` | Preview standup | — |

### System (`os.system.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `os.system.info` | Get system information | — |

### UI (`ui.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `ui.window.open` | Open a UI window | `type` (required), `title?` |
| `ui.window.close` | Close a window | `windowId` (required) |
| `ui.window.focus` | Focus a window | `windowId` (required) |
| `ui.window.list` | List open windows | — |
| `ui.confirm` | Show confirmation dialog | `message` (required), `chipId?` |
| `ui.navigate` | Navigate UI | `path` (required) |
| `ui.notification.show` | Show a notification | `title` (required), `body?`, `type?` |

### Inter-Agent (`agent.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `agent.message` | Send message to another agent | `target` (required), `content` (required) |
| `agent.list` | List active agents | — |
| `agent.status` | Get agent status | `agent_id?` |
| `agent.broadcast` | Broadcast to all agents | `content` (required) |
| `agent.ask_omaru` | Ask the main Omaru agent | `question` (required) |
| `agent.report` | Report to Omaru | `content` (required) |
| `agent.get_context` | Get shared context | `key?` |

### Vault (`vault.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `vault.status` | Vault status | — |
| `vault.list` | List vault entries | — |
| `vault.request` | Request a secret | `name` (required), `reason?` |
| `vault.get` | Get a secret value | `name` (required) |
| `vault.release` | Release a secret checkout | `name` (required) |

### Harness (`harness.*`)
| Command | Description | Key Params |
|---------|-------------|------------|
| `harness.log` | View recent harness actions | `limit?`, `command?`, `outcome?` |
