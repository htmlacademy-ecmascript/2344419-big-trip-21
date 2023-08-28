
import { infoContainerTemplite } from '../template/info-container-template.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class InfoView extends AbstractView{
  get template(){
    return infoContainerTemplite();
  }
}
