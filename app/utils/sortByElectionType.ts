import { Election } from "../redux/types";

const prioritizedElectionTypes = ['national', 'gubernatorial', 'senatorial', 'house-of-representatives', 'house-of-assembly', 'lga'];

function sortByElectionType(elections: Array<Election>) {
  const prioritizedElections = elections.filter((election) => prioritizedElectionTypes.includes(election.electionType));
  prioritizedElections.sort((a, b) => {
    return prioritizedElectionTypes.indexOf(a.electionType) > prioritizedElectionTypes.indexOf(b.electionType) ? 1 : -1;
  });
  const otherElections = elections.filter((election) => !prioritizedElectionTypes.includes(election.electionType));
  return [...prioritizedElections, ...otherElections];
};

export default sortByElectionType;

/*
This function takes an array of elections and sorts them based on the order of the election types in the  prioritizedElectionTypes  array. 
Now, we can use this function in our  ElectionList  component to sort the elections by election type.
*/