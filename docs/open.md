---
title: Open Issues 
---

Due to the large scope of the PEER project, a few points are still outstanding at this stage. These will be addressed in the following and an attempt will be made to outline a solution. Developers who would like to further develop PEER in the future should take up the following open issues and try to solve them.

- Sending emails only works with a private account, you have to replace credentials if you want them to work.
- Another important issue that future developers of PEER should address is the issue of chaining. It would be advantageous to use external software to read the submission accounts from the blockchain and then store them in a mapping. Here, the already assigned id of the submission process can be used to point to a submission within the mapping.
- The error handling of the smart contracts is not yet fully transparent.  It is currently unclear why transactions are rejected. This could be solved in future projects by catching the errors and returning them.
- If the personal address falls into the wrong hands, the illegitimate owner can theoretically do whatever he wants with it and, for example, publish theses under a false name. Future commits should investigate this danger and integrate additional security barriers into PEER.
- Currently, examiners cannot independently reject the publication to be corrected, but can only set the status not to verified and leave it at a lower status. Future projects should address this vulnerability and implement an additional rejection feature. 
- PEER only offers the submitter the possibility to submit his thesis if he knows the address of his examiner. Future developments of PEER could address this problem by implementing a kind of  verified address book. - 
- Another point that future development work could take up would be to set a doi when submitting the papers.
