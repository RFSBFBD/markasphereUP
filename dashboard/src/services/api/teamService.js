import { BaseRepository } from './baseRepository'

const TABLE = 'team_members'

export const teamService = {
  repository: new BaseRepository(TABLE),

  getAll(options) {
    // TODO: implement with ordering
  },

  getByRole(role) {
    // TODO: implement role filter
  },

  create(data) {
    // TODO: implement with avatar upload
  },

  update(id, data) {
    // TODO: implement with avatar update
  },

  remove(id) {
    // TODO: implement with avatar cleanup
  },

  reorder(ids) {
    // TODO: implement ordering
  }
}
