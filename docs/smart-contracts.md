---
title: Smart Contracts
---
A smart contract runs functional code on the blockchain, which ensures transparency and traceability, since every interaction that changes the state of a smart contract is saved in a transaction. This makes the concept suitable for an open access publication platform. In this chapter you will find the smart contracts necessary for the successful implementation of the publication platform and furthermore for a functioning submission process.

For reasons of capacity and overview, the contracts have been divided into different contracts to ensure better performance and decapsulation. Besides the reasons of better performance and clarity, a single contract cannot be larger than 24,576 kb to be deployed on the Ethereum blockchain. This limit was introduced to prevent denial-of-service (DOS) attacks. Therefore, the contracts have to be split up, as they would exceed this limit due to the high number of functions.

The individual contracts were written with the Solidity programming language in version 0.8.2 and are linked to each other by means of inheritance. The contracts created will be briefly presented in the following and central functions will be discussed:

- Controller
- Data
- Validation
- Migration

## Controller
The controller contract inherits from the contract data to get access to the different data. Furthermore, the controller accesses the validation library to be able to check the inputs for formal correctness.

All submitted submissions receive an individual ID to be able to assign them exactly, and are stored in a dynamic array to reach in an unlimited size of submissions. This is just possible to submit the thesis when the validation of the input parameters, given by the frontend was successful.
In addition we are providing to each submission three different states: accepted, corrected and verified. These states provide the submitter with a good overview of the current status of the submission.
The accepted state serves to check whether the examiner has accepted the thesis and feels responsible for the thesis. The corrected state is there to let the student know whether the thesis is already corrected or not. The verified state describes whether the submitted thesis meets the requirements to be published according to the examiner's correction.
When submitting a thesis, an ipfs-hash is generated. This hash is stored in an array. If the content of the thesis changes after a successful submission, the submitter can update his thesis and upload a new version of his thesis to PEER. A new ipfs-hash will be generated again. This is also stored in the same array with a new storage location number. If the work is updated several times, this process would require a dynamic array, and thus require a lot of storage capacity. This would ultimately result in high gas costs. To prevent this, the decision was made to limit the length of the array and only allow two ipfs-hashes. This is also stored in the same array with a new storage location number. If the work is updated several times, this process would require a dynamic array, and thus require a lot of storage capacity. This would ultimately result in high gas costs. To prevent this, the decision was made to limit the length of the array and only allow two ipfs-hashes. One is intended for the first handed-in version, while the second hash contains the latest update. Nevertheless, this compromise offers full transparency, as the original version is always preserved in memory and can be compared with the updated version.

To ensure tamper resistance, our software allows only to change the e-mail address of the students after a successful submission. This is because it is important that the persons involved can also contact each other later. But it also means that incorrect inputs of other metadata cannot be changed afterwards.
```shell
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;
import "./Data.sol";
import "./Validation.sol";

///Authors: Alexander Albert, Maximilian Bonkosch, Marco Spraul

/** @title Controller inerhits from data.sol */

///The Controller contract is used to to control all functions and interact with the front end
contract Controller is Data {

  /// Import Validation library for structs
  using Validation for Student;
  using Validation for Thesis;
  using Validation for Examiner;
  address submissionAddress;


  /// Counter to give every Submission an unique id
  uint public SubCount = 0;

  /// All submissions are saved in an dynamic array
  Submission[] public submissions;


  /// @dev function to validate the arguments typed in by the student
  /// @param student (Data.sol) ,
  /// return bool for validation was sucessfull (=true) or not sucessfull (=false)
  function validateStudent (Student memory student) public pure returns (bool){  //
    // Student memory student = Student("String Student", "String Student", "String Student", "String Student", "String Student", "String Student", "String Student", "String Student");
    return student.testStudent();
  }


  /// @dev function to validate the arguments typed in by the student
  /// @param examiner1 is a struct of Data.sol
  /// @return bool for validation was sucessfull (=true) or not sucessfull (=false)
  function validateExaminer (Examiner memory examiner1)public pure returns (bool){
    return examiner1.testExaminer();
  }

  /// @dev function to validate the arguments typed in by the student
  /// @param thesis1 is a struct of Data.sol
  /// @return bool for validation was sucessfull (=true) or not sucessfull (=false)
  function validateThesis (Thesis memory thesis1)public pure returns (bool){
    return thesis1.testThesis();
  }

  /// @dev function to create a submission and assign the submission to an ID (SubCount) with validating the input parameters before
  /// @param student Is a struct of Data.sol which contains the data of the student
  /// @param examiner Is a struct of Data.sol which contains the data of the examiner
  /// @param thesis Is a struct of Data.sol which contains the data of the thesis
  /// @return uint the ID is assigned to the submission
  function createSubmission(Student memory student, Examiner memory examiner, Thesis memory thesis) public returns (Submission memory, bool){
    if((validateStudent(student))&&(validateExaminer(examiner))&&(validateThesis(thesis))){
      submissions.push(Submission(SubCount, student, examiner, thesis, false, false, false));
      SubCount ++;
      return (Submission(SubCount, student, examiner, thesis, false, false, false), true);
    }else {
      return (Submission(SubCount, student, examiner, thesis, false, false, false), false);
    }
  }

  /// @dev function receive all submissions that have been created
  /// @param -
  /// @return Submission[] memory All Submissiosn that have been created
  function getSubmissions() public returns(Submission[] memory) {
    return submissions;
  }


  /// @dev function to show whether the examiner accepted the responsibility for the the thesis reached in by the student
  /// @param id ID which is assigned to a specific submission
  /// @return Submission memory Submission which is assigned to the ID
  function acceptSubmission(uint id) public returns (Submission memory){
    submissions[id].accepted = true;
    return submissions[id];
  }

  /// @dev function to show wheter the examiner has corrected the submission
  /// @param id ID which is assigned to a specific submission
  /// @return Submission memory Submission which is assigned to the ID
  function correctSubmission(uint id) public returns (Submission memory){       //anpassen
    submissions[id].corrected = true;
    return submissions[id];
  }
  /// @dev function to show wheter the examiner has verified the submission
  /// @param id ID which is assigned to a specific submission
  /// @param date To set a timestamp
  /// @return Submission memory Submission which is assigned to the ID
  function verifySubmission (uint id, string memory date) public returns (Submission memory){ //anpassen
    submissions[id].verified = true;
    submissions[id].thesis.uploaddate = date;
    return submissions[id];
  }


  /// @dev function to upload a an updated version of the thesis, no overwriting of the orgional ipfs hash possible through the array field includes validating of the new ipfs string
  /// @param id ID which is assigned to a specific submission
  /// @param adr Address of the Person who wants to change the IPFS Hash
  /// @param ipfs_thesis Contains the new ipfs string from the updated thesis
  /// @param ipfs_additional Contains the new ipfs string from the updated additional files
  function changeIpfsHash(uint id, address adr, string memory ipfs_thesis, string memory ipfs_additional,string memory date)public{
    require (
      (submissions[id].student.student_address ==adr || submissions[id].examiner.examiner_address==adr)&&
      Validation.testLengthHash(ipfs_thesis)==true && Validation.testString(ipfs_thesis)==true && Validation.testLengthHash(ipfs_additional)==true
      && Validation.testString(ipfs_additional)==true && Validation.testString(date)==true
    );
    bytes memory bytes_ipfs_thesis = abi.encodePacked(ipfs_thesis);
    bytes memory bytes_ipfs_additional = abi.encodePacked(ipfs_additional);
    if(bytes_ipfs_thesis.length > 0) {
      submissions[id].thesis.ipfs_hash_thesis[1] = ipfs_thesis;
    }
    if(bytes_ipfs_additional.length > 0) {
      submissions[id].thesis.ipfs_hash_additional[1] = ipfs_additional;
    }
    if((bytes_ipfs_thesis.length > 0) || (bytes_ipfs_additional.length > 0) ) {
      submissions[id].thesis.lastupdated = date;
    }
  }


  /// @dev function to change the E-mail address of a student in case of student have a new mail or is leaving the university
  /// @param id ID which is assigned to a specific submission
  /// @param adr Address of the student who wants to change the E-Mail
  /// @param mail Contains the Mail Address
  function changeStudentMail(uint id, address adr, string memory mail) public {                             //Student Mail ändern
    require((submissions[id].student.student_address ==adr ) && Validation.testString(mail)==true);
    submissions[id].student.email_student = mail;
  }


}
```

## Data

The Data Contract is divided into four different structs: Student, Exminer, Thesis and Submission.

This contract contains the data required for the transaction of uploading a publication. The first struct takes the information like his or her name, his email or his ipfs hash from the student, the second one about the examiner. The third struct contains the data required for the thesis. The fourth one which is called Submission contains all the data of the student, the examiner and the thesis as well as an id for assignment and various bools for querying the assessment status of the thesis.

```shell
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

///Authors: Alexander Albert, Maximilian Bonkosch, Marco Spraul

/** @title Data */

/// The Data contract is used to store the metadata of students, examiners and the thesis separately in structs.
/// All structs are then combined in the submission struct including the id and the submission status (accepted,corrected,verified).
contract Data{


  struct Student {
    string first_name_student; //!
    string last_name_student; //!
    string email_student; //!
    string field_of_study;
    string study_interests;
    string researchgate_profil;
    string google_scholar_profil;
    address student_address; //!
  }

  struct Examiner {
    string first_name_e; //!
    string last_name_e; //!
    string email_e; //!
    string institution_name; //!
    string department_name;
    string instituion_postal_address;
    string instituion_webite;
    string position_examiner;
    string examiner_profile_website; //!
    address examiner_address; //!
  }

  struct Thesis {
    string thesis_title; //!
    string thesis_topics; //!
    string applied_research_methods;
    string type_of_thesis; //!
    string thesis_language; //!
    string institution_name_thesis;
    string department_name_thesis;
    string instituion_postal_address_thesis;
    string instituion_website_thesis;
    string additional_comments;
    string uploaddate; //!
    string lastupdated; //!
    string[2] ipfs_hash_thesis;
    string[2] ipfs_hash_additional;
  }

  struct Submission {
    uint id;
    Student student;
    Examiner examiner;
    Thesis thesis;
    // examniner accepts allocation
    bool accepted;
    // examiner finished correction
    bool corrected;
    // examiner marks submission as verified
    bool verified;
  }

}
```

## Validation

The main objective of validation is to ensure that only correct data is stored to increase overall quality and prevent errors. The validation was implemented as a library. This ensures that no storage space is required in runtime, thus reducing gas costs since the library is deployed linked to another smart contract.

The library contains functions which are used to validate the input of the submitter in the function "Sumbit Your Thesis" in the frontend. The validation divides the structs into single attributes.

The various strings and the ipfs hash run through the function "testString", in which the individual letters are checked for correctness and special characters are excluded. In addition, the length of the address and the ipfs hash is checked for correctness in the function "testLengthAddress", to guarantee valid addresses. The logic of the "testString" in the current version is adapted to the German and English alphabets and also includes umlauts. Other alphabets, such as Danish umlauts, could be implemented later and integrated in a future version adapted to the respective country.

```shell
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;
import "./Data.sol";

///Authors: Alexander Albert, Maximilian Bonkosch, Marco Spraul

/** @title Validation*/

/// The Validation library is there to validate every single input given by the front-end.
/// A library is there to execute functions. There is no permanent storage of metdata.
library Validation  {

  /// @dev function to validate the input of the struct student
  /// @param student is given as a struct student
  /// @return bool whether the validation was sucessfull(=true) or not(=false)
  function testStudent(Data.Student memory student) public pure returns (bool) {

    if(!testString(student.first_name_student)) {
      return false;
    }

    if(!testString(student.last_name_student)) {
      return false;
    }
    if(!testString(student.email_student)) {
      return false;
    }

    if(!testString(student.field_of_study)) {
      return false;
    }

    if(!testString(student.study_interests)) {
      return false;
    }

    if(!testString(student.researchgate_profil)) {
      return false;
    }

    if(!testString(student.google_scholar_profil)) {
      return false;
    }

    if(!testLengthAddress(student.student_address)) {
      return false;
    }

    else {
      return true;
    }
  }

  /// @dev function to validate the input of the struct examiner
  /// @param examiner is given as a struct examiner
  /// @return bool whether the validation was sucessfull(=true) or not(=false)
  function testExaminer(Data.Examiner memory examiner) public pure returns (bool) {

    if(!testString(examiner.first_name_e)) {
      return false;
    }

    if(!testString(examiner.last_name_e)) {
      return false;
    }

    if(!testString(examiner.email_e)) {
      return false;
    }

    if(!testString(examiner.institution_name)) {
      return false;
    }

    if(!testString(examiner.department_name)) {
      return false;
    }

    if(!testString(examiner.instituion_postal_address)) {
      return false;
    }

    if(!testString(examiner.instituion_webite)) {
      return false;
    }

    if(!testString(examiner.position_examiner)) {
      return false;
    }

    if(!testString(examiner.examiner_profile_website)) {
      return false;
    }

    if(!testLengthAddress(examiner.examiner_address)) {
      return false;
    }

    else {
      return true;
    }
  }

  /// @dev function to validate the input of the struct thesis
  /// @param thesis is given as a struct thesis
  /// @return bool whether the validation was sucessfull(=true) or not (=false)
  function testThesis(Data.Thesis memory thesis) public pure returns (bool) {

    if(!testString(thesis.thesis_title)) {
      return false;
    }

    if(!testString(thesis.thesis_topics)) {
      return false;
    }

    if(!testString(thesis.applied_research_methods)) {
      return false;
    }

    if(!testString(thesis.type_of_thesis)) {
      return false;
    }

    if(!testString(thesis.thesis_language)) {
      return false;
    }

    if(!testString(thesis.institution_name_thesis)) {
      return false;
    }

    if(!testString(thesis.department_name_thesis)) {
      return false;
    }

    if(!testString(thesis.instituion_postal_address_thesis)) {
      return false;
    }

    if(!testString(thesis.instituion_website_thesis)) {
      return false;
    }

    if(!testString(thesis.additional_comments)) {
      return false;
    }

    if(!testString(thesis.uploaddate)) {
      return false;
    }

    if(!testString(thesis.lastupdated)) {
      return false;
    }

    if(!testLengthHash(thesis.ipfs_hash_thesis[0])) {
      return false;
    }

    if(!testLengthHash(thesis.ipfs_hash_thesis[1])) {
      return false;
    }

    if(!testLengthHash(thesis.ipfs_hash_additional[0])) {
      return false;
    }

    if(!testLengthHash(thesis.ipfs_hash_additional[1])) {
      return false;
    }

    else {
      return true;
    }
  }


  /// @dev function to validate each single punctuation marks, numbers and letters
  /// @param text declears which text will be validated
  /// @return bool whether the validation was sucessfull(=true) or not(=false)
  function testString(string memory text) public pure returns (bool) {
    bytes memory b = bytes(text);
    bool correct = true;
    for(uint i; i<b.length; i++){
      bytes1 char = b[i];
      if(
        !(char >= 0x30 && char <= 0x39) && //9-0
      !(char >= 0x41 && char <= 0x5A) && //A-Z
      !(char >= 0x61 && char <= 0x7A) && //a-z
      //,ä,Ä,ö;Ö,ü,Ü,ß,.,_,@,-
      !(char ==0xC3)&&
      !(char ==0xA4)&&    //ä
      !(char ==0x84)&&    //Ä
      !(char ==0xB6)&&    //ö
      !(char ==0x96)&&    //Ö
      !(char ==0xBC)&&    //ü
      !(char ==0x9C)&&    //Ü
      !(char ==0x9F)&&    //ß
      !(char ==0x2E)&&    //.
      !(char ==0x5F)&&    //_
      !(char ==0x40)&&    //@
      !(char ==0x2D)&&      //-
      !(char ==0x2F)&&    // /
      !(char ==0x20)&&    // Space
      !(char ==0x3A)&&    // :
      !(char ==0x26)&&    // &
      !(char == 0x3D)&&   // =
      !(char == 0x2C)&&   // ,
      !(char == 0x3F)     // ?
      ) {
        correct = false;
      }
    }
    return correct;
  }

  /// @dev function to validate the length of the address
  /// @param addr is the address which will be validated
  /// @return bool whether the validation was sucessfull(=true) or not(=false)
  function testLengthAddress(address addr) public pure returns (bool) {   // Teste Länge der Studenten Addresse ; wenn ungleich 20 Zeichen = false
    bytes memory a = abi.encodePacked(addr);
    if(a.length != 20) {
      return false;
    } else {return true;}
  }

  /// @dev function to validate the length of the ipfs hash
  /// @param hash is the ipfs hash which will be validated
  /// @return bool whether the validation was sucessfull(=true) or not(=false)
  function testLengthHash(string memory hash) public pure returns(bool){  // Teste Länge des IPFS Hashs
    bytes memory h = bytes(hash);
    if ((h.length>0 && h.length == 46) || h.length == 0) {
      return true;
    } else {return false;}
  }
}
```

## Migration 

```shell
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


///Authors: Alexander Albert, Maximilian Bonkosch, Marco Spraul

/** @title Migrations */

///The Migration contract is usd to set the migration to complete status
contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  /// @dev function to set the migration to complete statzs
  /// @param completed sets migration completed
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
```
