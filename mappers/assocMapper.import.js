import Assoc from 'models/Assoc';

export default {

  doToAssoc(ideaDO) {
    let assoc = new Assoc();

    assoc._id = ideaDO._id;
    assoc.from = ideaDO.from;
    assoc.to = ideaDO.to;

    return assoc;
  }

}