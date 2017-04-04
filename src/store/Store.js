import { UrlUpdateMember, UrlFindAllFloors, UrlFindAllTeamsByFloorId }  from '../containers/constants/UrlConstants';
import { extendObservable, action } from 'mobx';
import { toJS as mobxToJS } from 'mobx';
import axios from 'axios';
import moment from 'moment';

export default class Store {
 constructor() {
    extendObservable(this, {
      title: "D4 - Seating Map",
      floors: [],
      isMenuOpen: true,
      currentShownMember: {},
      currentTeam: '',
      isUserModalOpen: false,
      isNewUserModalOpen: false,
      isNewTeamModalOpen: false,
      isNewFloorModalOpen: false,
      selectedDays: [],
      newMemberName: '',
      newTeamName: '',
      newTeamLocation: '',
      newFloorName: '',
      currentFloor: {},
      currentFloorIndex: 0,
      teams: []
    });
 }
/*
TODO
 @action
 goToSlide(slide) {
   console.log(slide)
 }
 */

 @action
 fetchAllFloors() {
    return axios
     .get(UrlFindAllFloors).then((response) => {

       this.floors = mobxToJS(response.data);
       let isFirst = true;
       this.floors.forEach(floor => {
         axios.get(`${UrlFindAllTeamsByFloorId}${floor._id}`).then((resp) => {
           floor.teams = mobxToJS(resp.data);
           if(isFirst) {
             this.teams = floor.teams;
             this.currentFloor = floor;
             isFirst = false;
           }
         }).catch((err) => {
           console.log(err);
         });
       });
      }).catch((error) => {
        console.log(error);
      });
 }

 @action
 fetchTeams(floor_id) {
   return axios.get(`${UrlFindAllTeamsByFloorId}${floor_id}`).then((resp) => {
     this.teams = mobxToJS(resp.data);
     this.floors[this.currentFloorIndex].teams = this.teams;
     console.log(mobxToJS(resp.data));
   });
 }

 @action
 toggleMenu = () =>  {
   this.isMenuOpen = !this.isMenuOpen;
 }

 @action
 handleDayClick = (day) => {

   day.setHours(0,0,0,0);

   let copyOfSelectedDays = [...this.selectedDays]; // 3 = 3
   let currentMember = this.currentShownMember;

   // eslint-disable-next-line
   this.selectedDays.map((selectedDay, index) => {
     selectedDay.setHours(0,0,0,0);
     if (selectedDay.toString() === day.toString()) {
      copyOfSelectedDays.splice(index, 1);
    }
   });

   if(copyOfSelectedDays.length === this.selectedDays.length) {
       let formattedDay = moment(day).format('YYYY-MM-DD');
       this.selectedDays = [...this.selectedDays, day];

       currentMember.availabilityDates.push(formattedDay);
       this.currentShownMember = currentMember;
   } else {
      currentMember.availabilityDates = [];
      currentMember.availabilityDates = copyOfSelectedDays;
      this.currentShownMember = currentMember;
      this.selectedDays = copyOfSelectedDays;
   }

   return axios
   .put(UrlUpdateMember, currentMember)
   .then((response) => {
      this.fetchTeams(this.currentFloor._id);
   }).catch((error) => {
     console.log(error);
   });

  }

  @action
  hideModal = () => {
    this.isUserModalOpen = false;
    this.isNewUserModalOpen = false;
    this.isNewTeamModalOpen = false;
    this.isNewFloorModalOpen = false;
    this.newFloorName = '';
    this.newTeamLocation = '';
    this.newMemberName = '';
    this.currentTeam = '';
    this.newTeamName = '';
    }
}
