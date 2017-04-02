import { UrlFindAllMembers, UrlUpdateMember, UrlAddmember, UrlAddTeam }  from '../containers/constants/UrlConstants';
import { extendObservable, action } from 'mobx';
import { toJS as mobxToJS } from 'mobx';
import axios from 'axios';
import moment from 'moment';

export default class Store {
 constructor() {
    extendObservable(this, {
      title: "D4 - Seating Map",
      seats: [],
      isMenuOpen: true,
      currentShownMember: {},
      currentTeam: '',
      isUserModalOpen: false,
      isNewUserModalOpen: false,
      isNewTeamModalOpen: false,
      selectedDays: [],
      newMemberName: '',
      newTeamName: '',
      newTeamLocation: ''
    });
 }

 @action
 fetchAllTeams() {
   console.log("Fetching all teams.");

   return axios.get(UrlFindAllMembers).then((response) => {
    this.seats = response.data;
    console.log('seatings = ');
    console.log( response.data);
   }).catch((error) => {
  console.log(error);
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
      this.fetchAllTeams();
   }).catch((error) => {
     console.log(error);
   });

  }

  @action
  hideModal = () => {
    this.isUserModalOpen = false;
    this.isNewUserModalOpen = false;
    this.isNewTeamModalOpen = false;
    this.newTeamLocation = '';
    this.newMemberName = '';
    this.currentTeam = '';
    this.newTeamName = '';
    }
}
