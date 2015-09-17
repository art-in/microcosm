import Idea from 'models/Idea';

export default {

  doToIdea(ideaDO) {
    let idea = new Idea();

    idea._id = ideaDO._id;
    idea.x = ideaDO.x;
    idea.y = ideaDO.y;

    return idea;
  }

}