import type { UserRecord } from '../../types'
import { ActionButtons } from './ActionButtons'
import { StatusBadge } from './StatusBadge'

interface DataTableProps {
  rows: UserRecord[]
  loading?: boolean
  error?: string | null
  onDeleteUser?: (id: number) => Promise<void>
  deletingUserId?: number | null
}

export function DataTable({
  rows,
  loading = false,
  error = null,
  onDeleteUser,
  deletingUserId = null,
}: DataTableProps) {
  const shownRecords = rows.length

  return (
    <section className="datatable-card" aria-labelledby="datatable-title">
      <div className="datatable-header">
        <h1 id="datatable-title">Users</h1>
      </div>

      <div className="table-toolbar">
        <label className="entries-select">
          <select aria-label="Entries per page">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries per page</span>
        </label>

        <label className="search-input">
          <span>Search:</span>
          <input type="text" aria-label="Search table rows" />
        </label>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Date registered</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="table-message-cell">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="table-message-cell table-error-cell">
                  {error}
                </td>
              </tr>
            ) : (
              rows.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.dateRegistered}</td>
                  <td>{user.role}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td>
                    <ActionButtons
                      deleting={deletingUserId === user.id}
                      onDelete={async () => {
                        if (onDeleteUser) {
                          await onDeleteUser(user.id)
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="table-footer">
        <p>
          Showing {shownRecords > 0 ? 1 : 0} to {shownRecords} of {shownRecords} entries
        </p>
        <nav aria-label="Pagination">
          <ul className="pagination">
            <li>
              <button type="button" aria-label="Previous page">
                &lsaquo;
              </button>
            </li>
            <li>
              <button type="button" className="is-current" aria-current="page">
                1
              </button>
            </li>
            <li>
              <button type="button">2</button>
            </li>
            <li>
              <button type="button">3</button>
            </li>
            <li>
              <button type="button">4</button>
            </li>
            <li>
              <button type="button" aria-label="Next page">
                &rsaquo;
              </button>
            </li>
          </ul>
        </nav>
      </footer>
    </section>
  )
}
