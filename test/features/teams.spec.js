module.exports = function (actions) {
  describe('Teams 	- Creating/Deleting/Editing a team',function(){
    describe('Create ',function() {
      actions.logout();
      actions.iAmLoggedInFor('teamUser');
      actions.goToPage('#/');
      actions.clickOnClass('#user-menu');
      actions.clickOnElementWithText(' Payment Info');
      actions.checkingUrlEndsWith('#/profile/payment/view');
      actions.clickOnElementWithText('Add Credit Card');
      actions.enterTextInField('#cardholderName','Test');
      actions.enterTextInField('#ccNumber','4111111111111111');
      actions.enterTextInField('#securityCode','411');
      actions.clickOnClass('#form-group-ccExpiryMonth');
      actions.clickOnElementWithText('01');
      actions.clickOnClass('#form-group-ccExpiryYear');
      actions.clickOnElementWithText('25');
      actions.clickOnClass('#submit');
      actions.waitForActionToComplete(2000);
      actions.goToPage('#/');
      actions.clickOnElementWithText('New Project');
      actions.enterTextInField('#title','testTeam');
      actions.clickOnElementWithText(' Create Project');
      actions.clickOnElementWithText('Trial');
      actions.upgradeToPlan("Basic");
      actions.clickOnButton(' Confirm Billing Change');
      actions.waitForActionToComplete(2000);
      actions.clickOnElementWithText(' Teams');
      actions.iSeeText('Upgrade your project to Team Pro or above to enable teams.');
      actions.clickOnElementWithText('Plan and Pricing');
      actions.upgradeToPlan("Independent");
      actions.clickOnButton(' Confirm Billing Change');
      actions.waitForActionToComplete(2000);
      actions.clickOnElementWithText(' Teams');
      actions.iSeeText('Upgrade your project to Team Pro or above to enable teams.');
      actions.logout();
      actions.userExistsWith('${random-name>login1.name}','${random-email>login1.email}','${random-password>login1.password}');
      actions.userExistsWith('${random-name>login2.name}','${random-email>login2.email}','${random-password>login2.password}');
      actions.enterTextInField('.login-container #email','${login1.email}');
      actions.enterTextInField('.login-container #password','${login1.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.clickOnElementWithText('New Project');
      actions.enterTextInField('#title','teamsProject');
      actions.clickOnElementWithText(' Create Project');
    // actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(2000);
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.caret.pull-right');
      actions.iDonotSeeText('Beta Team');
      actions.clickOnElementWithText('Create a New Team');
      actions.checkingUrlEndsWith('/create/team');
      actions.clickOnElementWithText('Submit');
      actions.checkingUrlEndsWith('/create/team');
      actions.clickOnClass('.fa.fa-home');
      actions.clickOnElementWithText(' Create Team');
      actions.enterTextInField('#name','Beta Team');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Submit');
    // actions.clickOnClass('.toast-message');
      actions.checkingUrlEndsWith('/view');
      actions.clickOnClass('.fa.fa-home');
      actions.clickOnElementWithText('teamsProject');
      //actions.pageReload();
      actions.waitForActionToComplete(2000);
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.caret.pull-right');
      actions.iSeeText('Beta Team');
      actions.clickOnClass('.fa.fa-home');
      actions.clickOnElementWithText('Beta Team');
      actions.iSeeText('Beta Team');
      actions.iSeeText('${login1.name}');
      actions.iSeeText('OWNER');
      actions.clickOnClass('.fa.fa-home');
      actions.clickOnElementWithText('Beta Team');
      actions.checkingUrlEndsWith('/view');
      actions.clickOnClass('.caret.pull-right');
      actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login2.name}');
      actions.clickOnElementWithText('${login2.name}');
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('${login2.name}');
      actions.iSeeText('TEAM MEMBER');
      actions.iSeeText('2');
      actions.clickOnClass('.fa.fa-cog');
      actions.iSeeText('Make team admin');
      actions.iSeeText('Remove from team');
      actions.clickOnElementWithText('Remove from team');
    // actions.clickOnClass('.toast-message');
      actions.iDonotSeeText('${login2.name}');
      actions.iDonotSeeText('TEAM MEMBER');
      actions.iDonotSeeText('2');
      actions.clickOnClass('.caret.pull-right');
      actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login2.name}');
      actions.clickOnElementWithTextIndex('${login2.name}',0);
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('${login2.name}');
      actions.iSeeText('TEAM MEMBER');
      actions.iSeeText('2');
      actions.clickOnElementWithTextIndex('Projects',1);
      actions.iSeeText('Team is not assigned to any project. Visit the project team page to assign.');
      actions.clickOnElementWithText('Delete Team');
      actions.clickOnElementWithText('No');
      actions.checkingUrlEndsWith('/view');
      actions.clickOnElementWithText('Delete Team');
      actions.clickOnElementWithText('Yes');
    // actions.clickOnClass('.toast-message');
      actions.checkingUrlIamOn('#/');
      actions.iDonotSeeText('Beta Team');
      actions.clickOnElementWithText('teamsProject');
      //actions.pageReload();
      actions.waitForActionToComplete(2000);
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.caret.pull-right');
      actions.iDonotSeeText('Beta Team');
      actions.clickOnElementWithText('Create a New Team');
      actions.checkingUrlEndsWith('/create/team');
      actions.enterTextInField('#name','Beta Team');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Submit');
    // actions.clickOnClass('.toast-message');
    });
    describe('Team Owner',function() {
      actions.logout();
      actions.userExistsWith('${random-name>login4.name}','${random-email>login4.email}','${random-password>login4.password}');
      actions.userExistsWith('${random-name>login5.name}','${random-email>login5.email}','${random-password>login5.password}');
      actions.logout();
      actions.enterTextInField('.register-container #name', '${random-name>register3.name}');
      actions.enterTextInField('.register-container #email', '${random-email>register3.email}');
      actions.enterTextInField('.register-container #password', '${random-password>register3.password}');
      actions.enterTextInField('.register-container #verifyPassword', '${register3.password}');
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('REGISTER');
      actions.goToPage('#/');
      actions.clickOnElementWithText('New Project');
      actions.enterTextInField('#title','teamProProject');
      actions.clickOnElementWithText(' Create Project');
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.caret.pull-right');
      actions.iDonotSeeText('Beta Team');
      actions.clickOnElementWithText('Create a New Team');
      actions.checkingUrlEndsWith('/create/team');
      actions.enterTextInField('#name','Beta Team');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Submit');
    // actions.clickOnClass('.toast-message');
      actions.clickOnClass('.caret.pull-right');
      actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login4.name}');
      actions.clickOnElementWithTextIndex('${login4.name}',0);
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('${login4.name}');
      actions.iSeeText('TEAM MEMBER');
      actions.iSeeText('2');
      actions.iSeeText('${register3.name}');
      actions.iSeeText('${login4.name}');
      actions.clickOnClass('.fa.fa-home');
      actions.iSeeText('Beta Team');
      actions.clickOnElementWithText('teamProProject');
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.caret.pull-right');
      actions.iSeeText('Beta Team');
      actions.clickOnElementWithText('Beta Team');
      actions.clickOnClass('.fa.fa-home');
      actions.clickOnElementWithText('Beta Team');
      actions.clickOnElementWithTextIndex('Projects',1);
      actions.iSeeText('teamProProject');
      actions.logout();
      actions.enterTextInField('.login-container #email','${login4.email}');
      actions.enterTextInField('.login-container #password','${login4.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.iSeeText('teamProProject');
      actions.clickOnElementWithText('Beta Team');
      actions.iDonotSeeText('Add a person');
      actions.logout();
      actions.enterTextInField('.login-container #email','${register3.email}');
      actions.enterTextInField('.login-container #password','${register3.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.clickOnElementWithText('Beta Team');
      actions.clickOnClass('.fa.fa-cog');
      actions.clickOnElementWithText('Remove from team');
    // actions.clickOnClass('.toast-message');
      actions.logout();
      actions.enterTextInField('.login-container #email','${login4.email}');
      actions.enterTextInField('.login-container #password','${login4.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.iDonotSeeText('teamProProject');
      actions.logout();
      actions.enterTextInField('.login-container #email','${register3.email}');
      actions.enterTextInField('.login-container #password','${register3.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.clickOnElementWithText('Beta Team');
      actions.clickOnClass('.caret.pull-right');
      actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login4.name}');
      actions.clickOnElementWithTextIndex('${login4.name}',0);
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('${login4.name}');
      // actions.clickOnClass('.fa.fa-cog');
      // actions.clickOnElementWithText('Make team admin');
      // actions.clickOnClass('.toast-message');
      // actions.iSeeText('TEAM ADMIN');
      // actions.logout();
      // actions.enterTextInField('.login-container #email','${login4.email}');
      // actions.enterTextInField('.login-container #password','${login4.password}');
      // actions.clickOnElementWithText('LOG IN');
      // actions.goToPage('#/');
      // actions.clickOnElementWithText('Beta Team');
      // actions.clickOnClass('.caret.pull-right');
      // actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login5.name}');
      // actions.clickOnElementWithTextIndex('${login5.name}',0);
      // actions.clickOnClass('.toast-message');
      // actions.iSeeText('${login5.name}');
    });
    describe('Assigning Team To Project - As Team Owner',function() {
      actions.goToPage('#/');
      actions.clickOnElementWithText('New Project');
      actions.enterTextInField('#title','basicProject');
      actions.clickOnElementWithText(' Create Project');
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Trial');
      actions.upgradeToPlan("Basic");
      actions.clickOnButton(' Confirm Billing Change');
      actions.waitForActionToComplete(2000);
      actions.iSeeTextIn("a.project-plan.label-info","Basic");
      actions.clickOnElementWithText(' Teams');
      actions.iSeeText('Upgrade your project to Team Pro or above to enable teams.');
      actions.goToPage('#/');
      actions.waitForActionToComplete(50000);
      actions.clickOnElementWithTextIndex(' Manage Teams',1);
      actions.checkingUrlEndsWith('/teams');
      actions.iSeeText('Beta Team');
      actions.iSeeText('2 Members');
      actions.clickOnElementWithTextIndex('Project Read',1);
      actions.clickOnElementWithTextIndex('Project Write',1);
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithTextIndex('Project Write',1);
      actions.clickOnElementWithTextIndex('Project Admin',1);
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Beta Team');
      actions.iSeeText('1');
      actions.clickOnElementWithTextIndex('Projects',1);
      actions.iSeeText('teamProProject');
      actions.iSeeText('Admin');
      actions.clickOnClass('.glyphicon.glyphicon-edit');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnElementWithTextIndex('Project Admin',1);
      actions.clickOnElementWithTextIndex('Project Write',1);
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Beta Team');
      actions.clickOnElementWithTextIndex('Projects',1);
      actions.iSeeText('teamProProject');
      actions.iSeeText('Write');
      actions.clickOnClass('.glyphicon.glyphicon-edit');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.fa.fa-times');
    // actions.clickOnClass('.toast-message');
      actions.goToPage('#/');
      actions.clickOnElementWithText('Beta Team');
      actions.iSeeText('0');
      actions.clickOnElementWithTextIndex('Projects',1);
      actions.iDonotSeeText('teamProProject');
    });
    describe('READ Permission',function() {
      actions.logout();
      actions.userExistsWith('${random-name>login1.name}','${random-email>login1.email}','${random-password>login1.password}');
      actions.userExistsWith('${random-name>login2.name}','${random-email>login2.email}','${random-password>login2.password}');
      actions.enterTextInField('.login-container #email','${login1.email}');
      actions.enterTextInField('.login-container #password','${login1.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.clickOnElementWithText('New Project');
      actions.enterTextInField('#title','teamsProject');
      actions.clickOnElementWithText(' Create Project');
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnElementWithText('Create a New Team');
      actions.checkingUrlEndsWith('/create/team');
      actions.enterTextInField('#name','Beta Team');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Submit');
    // actions.clickOnClass('.toast-message');
      actions.clickOnClass('.caret.pull-right');
      actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login2.name}');
      actions.clickOnElementWithTextIndex('${login2.name}',0);
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('${login2.name}');
      actions.iSeeText('TEAM MEMBER');
      actions.iSeeText('2');
      actions.goToPage('#/');
      actions.clickOnElementWithText('teamsProject');
      actions.clickOnElementWithText('Forms');
      actions.checkingUrlEndsWith('/form/');
      actions.clickOnElementWithText(' New Form');
      actions.clickOnElementWithText('API Web Form');
      actions.iSeeElement('.form-edit');
      actions.enterTextInField('#title','Test Form');
      actions.dragTo('Text Field', 'formarea');
      actions.iSeeText('Text Field Component');
      actions.enterTextInField('#label', 'Text Field');
      actions.clickOnElementWithText('Save');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Create Form');
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText(' Use');
      actions.iSeeText('Submit Form');
      actions.iSeeText('Text Field');
      actions.enterTextInField('#textField','Test Submission');
      actions.clickOnButton('Submit');
      actions.iSeeTextIn(".toast-message",'New submission added!');
      actions.clickOnElementWithText(' Teams');
      actions.checkingUrlEndsWith('/teams');
      actions.clickOnClass('.caret.pull-right');
      actions.iSeeText('Beta Team');
      actions.clickOnElementWithText('Beta Team');
      actions.iSeeTextCount('Project Read',3);
      actions.logout();
      actions.enterTextInField('.login-container #email','${login2.email}');
      actions.enterTextInField('.login-container #password','${login2.password}');
      actions.clickOnElementWithText('LOG IN');
      actions.goToPage('#/');
      actions.clickOnElementWithText('teamsProject');
      // actions.iSeeText('read-only project member');
      actions.iDonotSeeText(' Teams');
      actions.clickOnElementWithText('Forms');
      actions.clickOnClass('.glyphicon.glyphicon-trash');
      actions.iSeeText('Are you sure you wish to delete the form?');
      actions.clickOnButton('Yes');
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('Are you sure you wish to delete the form?');
      actions.clickOnElementWithText('Resources');
      actions.clickOnClass('.glyphicon.glyphicon-trash');
      actions.iSeeText('Are you sure you wish to delete the form?');
      actions.clickOnButton('Yes');
    // actions.clickOnClass('.toast-message');
      actions.iSeeText('Are you sure you wish to delete the form?');
      actions.clickOnElementWithText('Forms');
      actions.checkingUrlEndsWith('/form/');
      actions.clickOnElementWithText(' New Form');
      actions.clickOnElementWithText('API Web Form');
      actions.iSeeElement('.form-edit');
      actions.enterTextInField('#title','Test Form');
      actions.dragTo('Text Field', 'formarea');
      actions.iSeeText('Text Field Component');
      actions.enterTextInField('#label', 'Text Field');
      actions.clickOnElementWithText('Save');
      actions.pageReload();
      actions.iSeeText('Your highest role is Team Read, so you may view the form, but no changes will be persisted.');
      actions.clickOnElementWithText('Resources');
      actions.clickOnElementWithText(' Use');
      actions.iSeeText('User Resource ');
      actions.iSeeText('Submit Form');
      actions.iSeeText('Email ');
      actions.iSeeText('Password ');
      actions.enterTextInField('#email', 'test@automation');
      actions.enterTextInField('#password', 'password');
      actions.clickOnElementWithText('Submit');
    // actions.clickOnClass('.toast-message');
      actions.iDonotSeeText('View');
      actions.iDonotSeeText('Edit');
      actions.iDonotSeeText('Delete');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText('Test Form');
      actions.clickOnElementWithText(' Data');
      actions.clickOnElementWithText('Test Submission');
      actions.clickOnElementWithText(' Delete');
      actions.clickOnElementWithText('Delete');
      actions.iSeeText('Test Submission');
      actions.clickOnElementWithText('Test Submission');
      actions.clickOnElementWithTextIndex(' Edit',1);
      actions.enterTextInField('#textField','Updated Test Submission');
      actions.clickOnButton('Submit');
      actions.checkingUrlEndsWith('/edit');
      actions.clickOnElementWithText(' Actions');
      actions.pageReload();
      actions.clickOnElementWithText('Save Submission');
      actions.iSeeText('Your highest role is Team Read, so you may view existing actions, but not edit them.');
      actions.clickOnElementWithText(' Access');
      actions.iSeeText('Your highest role is Team Read, so you may view the form access, but not change it.');
      actions.clickOnClassWithIndex('.ui-select-search',1);
      actions.clickOnElementWithText('Anonymous');
    // actions.clickOnClass('.toast-message');
      actions.iSeeTextCount('Anonymous',2);
      actions.pageReload();
      actions.iSeeTextCount('Anonymous',1);
      actions.clickOnElementWithText('Access');
      actions.clickOnClass('.ui-select-search');
      actions.clickOnElementWithText('Anonymous');
    // actions.clickOnClass('.toast-message');
      actions.iSeeTextCount('Anonymous',4);
      actions.pageReload();
      actions.iSeeTextCount('Anonymous',3);
      actions.clickOnElementWithText(' New Role');
      actions.enterTextInField('#title','Testing Role');
      actions.clickOnElementWithText('Create Role');
    // actions.clickOnClass('.toast-message');
    // actions.clickOnClass('.toast-message');
      actions.checkingUrlEndsWith('/roles//edit');
      actions.clickOnElementWithText('Access');
      actions.clickOnClassWithIndex('.glyphicon.glyphicon-trash',2);
      actions.iSeeText('Are you sure you wish to delete the role ');
      actions.clickOnButton('Yes');
      actions.iSeeText('Are you sure you wish to delete the role ');
    // actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('+ New Stage');
      actions.enterTextInField('#title','Test');
      actions.clickOnElementWithText(' Add Stage');
    // actions.clickOnClass('.toast-message');
      actions.iDonotSeeText('Test Project Url:');
      actions.clickOnElementWithText('Settings');
      actions.checkingUrlEndsWith('/overview');
    });
    // describe('Write Permission',function() {
    //   actions.logout();
    //   actions.userExistsWith('${random-name>login1.name}','${random-email>login1.email}','${random-password>login1.password}');
    //   actions.userExistsWith('${random-name>login2.name}','${random-email>login2.email}','${random-password>login2.password}');
    //   actions.enterTextInField('.login-container #email','${login1.email}');
    //   actions.enterTextInField('.login-container #password','${login1.password}');
    //   actions.clickOnElementWithText('LOG IN');
    //   actions.goToPage('#/');
    //   actions.clickOnElementWithText('New Project');
    //   actions.enterTextInField('#title','teamsProject');
    //   actions.clickOnElementWithText(' Create Project');
    // // actions.clickOnClass('.toast-message');
    //   // actions.pageReload();
    //   // actions.waitForActionToComplete(2000);
    //   actions.clickOnElementWithText(' Teams');
    //   actions.checkingUrlEndsWith('/teams');
    //   actions.clickOnElementWithText('Create a New Team');
    //   actions.checkingUrlEndsWith('/create/team');
    //   actions.enterTextInField('#name','Beta Team');
    //   actions.waitForActionToComplete(1000);
    //   actions.clickOnElementWithText('Submit');
    // // actions.clickOnClass('.toast-message');
    //   actions.clickOnClass('.caret.pull-right');
    //   actions.enterTextInField('xpath://*[@id="main-wrapper"]/div/div/div/div[2]/div[1]/div[1]/div/div/input[1]','${login2.name}');
    //   actions.clickOnElementWithTextIndex('${login2.name}',0);
    // // actions.clickOnClass('.toast-message');
    //   actions.iSeeText('${login2.name}');
    //   actions.iSeeText('TEAM MEMBER');
    //   actions.iSeeText('2');
    //   actions.goToPage('#/');
    //   actions.clickOnElementWithText('teamsProject');
    //   actions.clickOnElementWithText('Forms');
    //   actions.checkingUrlEndsWith('/form/');
    //   actions.clickOnElementWithText(' New Form');
    //   actions.clickOnElementWithText('API Web Form');
    //   actions.enterTextInField('#title','Test Form');
    //   actions.dragTo('Text Field', 'formarea');
    //   actions.iSeeText('Text Field Component');
    //   actions.enterTextInField('#label', 'Text Field');
    //   actions.clickOnElementWithText('Save');
    //   actions.waitForActionToComplete(1000);
    //   actions.clickOnElementWithText('Create Form');
    // // actions.clickOnClass('.toast-message');
    //   actions.clickOnElementWithText(' Use');
    //   actions.iSeeText('Submit Form');
    //   actions.iSeeText('Text Field');
    //   actions.enterTextInField('#textField','Test Submission');
    //   actions.clickOnButton('Submit');
    //   actions.iSeeTextIn(".toast-message",'New submission added!');
    //   // actions.pageReload();
    //   // actions.waitForActionToComplete(2000);
    //   actions.clickOnElementWithText(' Teams');
    //   actions.checkingUrlEndsWith('/teams');
    //   actions.clickOnClass('.caret.pull-right');
    //   actions.iSeeText('Beta Team');
    //   actions.clickOnElementWithText('Beta Team');
    //   actions.clickOnElementWithTextIndex('Project Read',1);
    //   actions.clickOnElementWithTextIndex('Project Write',1);
    // // actions.clickOnClass('.toast-message');
    //   actions.logout();
    //   actions.enterTextInField('.login-container #email','${login2.email}');
    //   actions.enterTextInField('.login-container #password','${login2.password}');
    //   actions.clickOnElementWithText('LOG IN');
    //   actions.goToPage('#/');
    //   actions.clickOnElementWithText('teamsProject');
    //   // actions.waitForActionToComplete(2000);
    //   // actions.pageReload();
    //   // actions.iSeeText('member');
    //
    //   actions.clickOnElementWithText('Forms');
    //   actions.checkingUrlEndsWith('/form/');
    //   actions.clickOnClass('.glyphicon.glyphicon-trash');
    //   actions.iSeeText('User Login Form ');
    //   actions.iSeeText('Are you sure you wish to delete the form?');
    //   actions.clickOnButton('No');
    //   actions.checkingUrlEndsWith('/form/');
    //   actions.iSeeText('User Login');
    //   actions.clickOnClass('.glyphicon.glyphicon-trash');
    //   actions.iSeeText('Are you sure you wish to delete the form?');
    //   actions.clickOnButton('Yes');
    // // actions.clickOnClass('.toast-message');
    //   actions.checkingUrlEndsWith('/form/');
    //   actions.iDonotSeeText('User Login');
    //
    //   actions.clickOnElementWithText('Resources');
    //   actions.clickOnClass('.glyphicon.glyphicon-trash');
    //   actions.checkingUrlEndsWith('/delete');
    //   actions.clickOnButton('No');
    //   actions.checkingUrlEndsWith('/resource/');
    //   actions.iSeeText('User');
    //   actions.clickOnClass('.glyphicon.glyphicon-trash');
    //   actions.checkingUrlEndsWith('/delete');
    //   actions.clickOnButton('Yes');
    // // actions.clickOnClass('.toast-message');
    //   actions.checkingUrlEndsWith('/resource/');
    //   actions.iDonotSeeText('User');
    //
    //
    //   actions.clickOnElementWithText('Forms');
    //   actions.checkingUrlEndsWith('/form/');
    //   actions.clickOnElementWithText(' New Form');
    //   actions.clickOnElementWithText('API Web Form');
    //   actions.enterTextInField('#title','Write Test Form');
    //   actions.dragTo('Text Field', 'formarea');
    //   actions.iSeeText('Text Field Component');
    //   actions.enterTextInField('#label', 'Text Field');
    //   actions.clickOnElementWithText('Save');
    //   actions.waitForActionToComplete(1000);
    //   actions.clickOnElementWithText('Create Form');
    // // actions.clickOnClass('.toast-message');
    //   actions.clickOnElementWithText(' Use');
    //   actions.iSeeText('Submit Form');
    //   actions.iSeeText('Text Field');
    //   actions.enterTextInField('#textField','Test Submission');
    //   actions.clickOnButton('Submit');
    // // actions.clickOnClass('.toast-message');
    //   actions.clickOnElementWithText(' Data');
    //   actions.clickOnElementWithText('Test Submission');
    //   actions.clickOnElementWithTextIndex(' Edit',1);
    //   actions.enterTextInField('#textField','Updated Test Submission');
    //   actions.clickOnButton('Submit');
    //   actions.clickOnElementWithText(' Data');
    //   actions.clickOnElementWithText('Updated Test Submission');
    //   actions.clickOnElementWithText(' Delete');
    //   actions.clickOnElementWithText('Delete');
    //   actions.iDonotSeeText('Updated Test Submission');
    //   actions.clickOnElementWithText(' Actions');
    //   actions.pageReload();
    //   actions.clickOnElementWithText('Save Submission');
    //   actions.iDonotSeeText('Your highest role is Team Read, so you may view existing actions, but not edit them.');
    //   actions.clickOnElementWithText(' Access');
    //   actions.iDonotSeeText('Your highest role is Team Read, so you may view the form access, but not change it.');
    //   actions.clickOnElementWithText('Access');
    //   actions.clickOnElementWithText(' New Role');
    //   actions.enterTextInField('#title','Testing Role');
    //   actions.clickOnElementWithText('Create Role');
    // // actions.clickOnClass('.toast-message');
    //   actions.clickOnElementWithText('Access');
    //   actions.iSeeText('Testing Role');
    //   actions.clickOnClassWithIndex('.glyphicon.glyphicon-trash',2);
    //   actions.iSeeText('Are you sure you wish to delete the role ');
    //   actions.clickOnButton('Yes');
    //   actions.iDonotSeeText('Authenticated');
    // // actions.clickOnClass('.toast-message');
    //   actions.clickOnElementWithText('Settings');
    //   actions.checkingUrlEndsWith('/overview');
    // });
  });
};
