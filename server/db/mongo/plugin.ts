const mongooseHidden = require('mongoose-hidden')();

function timestampToMilSecond(v) {
  return v ? v.getTime() : v;
}

export default function defaultPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    getters: true,
  });
  schema.set('timestamps', true);
  schema.path('createdAt').get(timestampToMilSecond);
  schema.path('updatedAt').get(timestampToMilSecond);
  schema.plugin(mongooseHidden);
}
