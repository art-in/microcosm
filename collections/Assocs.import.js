import mapper from 'mappers/assocMapper';

export default new Mongo.Collection('assocs', {transform: mapper.doToAssoc});