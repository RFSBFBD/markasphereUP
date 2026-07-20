import { BaseRepository } from './baseRepository'

const TABLE = 'partners'

export const partnerService = {
  repository: new BaseRepository(TABLE),

  getAll(options) {
    // TODO: implement with ordering
  },

  getActive() {
    // TODO: implement active partners only
  },

  create(data) {
    // TODO: implement with logo upload
  },

  update(id, data) {
    // TODO: implement with logo update
  },

  remove(id) {
    // TODO: implement with logo cleanup
  },

  reorder(ids) {
    // TODO: implement ordering
  }
}
