const { Schema, model } = require("mongoose");
const commentSchema = require("./Comment");
const dateFormat = require("../utils/dateFormat");

const projectSchema = new Schema(
  {
    projectTitle: {
      type: String,
      required: "You need a title for your project!",
      minlength: 1,
    },
    projectText: {
      type: String,
      required: "You need to leave instructions for your project!",
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

projectSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

const Project = model("Project", projectSchema);

module.exports = Project;
