import mapper from 'mappers/ideaMapper';

export default new Mongo.Collection('ideas', {transform: mapper.doToIdea});