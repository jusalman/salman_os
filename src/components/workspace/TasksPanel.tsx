import { taskPriorityLabel, taskStatusLabel } from '../../domain/labels'
import type { ClientTaskPanelItem } from '../../types'
import { Panel } from '../common/Panel'

type TasksPanelProps = {
  tasks: ClientTaskPanelItem[]
}

export function TasksPanel({ tasks }: TasksPanelProps) {
  return (
    <Panel title="업무" subtitle="고객사별 진행 업무">
      <div className="stack">
        {tasks.map((task) => (
          <article key={task.id} className="item-row">
            <div>
              <strong>{task.title}</strong>
              <p>{task.note}</p>
            </div>
            <div className="item-meta">
              <span className={`status-badge ${task.status}`}>{taskStatusLabel[task.status]}</span>
              <span>{`우선순위 ${taskPriorityLabel[task.priority]}`}</span>
              <span>{task.assignee}</span>
              <span>{task.dueDate}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
