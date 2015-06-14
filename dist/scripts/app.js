"use strict";angular.module("formioApp",["ngSanitize","ngAnimate","restangular","ui.router","ui.bootstrap","ui.bootstrap.alert","ui.bootstrap.tpls","ui.select","ui.bootstrap.datetimepicker","angularMoment","ngCkeditor","formioApp.controllers","formioApp.services"]).config(["$stateProvider","$urlRouterProvider","FormioProvider","RestangularProvider","AppConfig",function(e,o,t,r,n){t.setBaseUrl(n.apiBase),r.setBaseUrl(n.apiBase),e.state("home",{url:"/?",templateUrl:"views/home/home.html",controller:"HomeController"}).state("auth",{"abstract":!0,url:"/auth",templateUrl:"views/user/auth.html"}).state("auth.login",{url:"/login",parent:"auth",templateUrl:"views/user/login.html",controller:"UserLoginController"}).state("auth.register",{url:"/register",parent:"auth",templateUrl:"views/user/register.html",controller:"UserRegisterController"}).state("settings",{url:"/settings",templateUrl:"views/user/settings.html"}).state("profile",{"abstract":!0,url:"/profile",templateUrl:"views/user/profile/profile.html"}).state("profile.view",{url:"/view",parent:"profile",templateUrl:"views/user/profile/profile-view.html"}).state("profile.edit",{url:"/edit",parent:"profile",templateUrl:"views/user/profile/profile-edit.html"}).state("app",{url:"/app/:appId",controller:"AppController",templateUrl:"views/app/app.html"}).state("createApp",{url:"/create/app",templateUrl:"views/app/create.html",controller:"AppCreateController"}).state("app.view",{url:"/view",parent:"app",templateUrl:"views/app/view.html"}).state("app.edit",{url:"/edit",parent:"app",templateUrl:"views/app/edit.html",controller:"AppEditController"}).state("app.settings",{url:"/settings",parent:"app",templateUrl:"views/app/settings.html",controller:"AppSettingsController"}).state("app.delete",{url:"/delete",parent:"app",templateUrl:"views/app/delete.html",controller:"AppDeleteController"}).state("team",{url:"/team/:teamId",controller:"TeamController",templateUrl:"views/team/team.html"}).state("createTeam",{url:"/create/team",controller:"TeamCreateController",templateUrl:"views/team/create.html"}).state("team.view",{url:"/view",parent:"team",templateUrl:"views/team/view.html"}).state("team.edit",{url:"/edit",parent:"team",controller:"TeamEditController",templateUrl:"views/team/edit.html"}).state("team.delete",{url:"/delete",parent:"team",controller:"TeamDeleteController",templateUrl:"views/team/delete.html"}).state("importExport",{url:"/import-export",templateUrl:"views/import/index.html",controller:"ImportExportController"}).state("help",{url:"/help",templateUrl:"views/help/index.html",controller:"HelpIndexController"}),o.otherwise("/")}]).controller("HomeController",["$scope","$rootScope","Formio","$window","AppConfig",function(e,o,t,r,n){o.activeSideBar="home",o.currentApp=null,e.teams=[],e.teamsLoading=!0,e.teamsUrl=o.teamForm+"/submission",e.$on("pagination:loadPage",function(){e.teamsLoading=!1,angular.element("#team-loader").hide()}),e.apps={},e.appsLoading=!0,t.loadApps().then(function(o){e.appsLoading=!1,angular.element("#apps-loader").hide(),e.apps=o}),e.startTutorial=function(){r.open(n.tutorial,"formio-tutorial","height=640,width=960")}}]).filter("trusted",["$sce",function(e){return function(o){return e.trustAsResourceUrl(o)}}]).run(["$state","$stateParams","$rootScope","FormioAlerts","Formio","AppConfig","$location","$window",function(e,o,t,r,n,a,i,l){a.forceSSL&&"https"!==i.protocol()&&(l.location.href=i.absUrl().replace("http","https")),t.userForm=a.userForm,t.userLoginForm=a.userLoginForm,t.userRegisterForm=a.userRegisterForm,t.teamForm=a.teamForm,e.go("home"),t.user||n.currentUser().then(function(e){t.user=e}),t.alerts=[],t.closeAlert=function(e){t.alerts.splice(e,1)},t.$state=e,t.$stateParams=o,t.$on("$stateChangeSuccess",function(e,o,n,a,i){t.alerts=r.getAlerts(),t.previousState=a.name,t.previousParams=i,t.currentState=o.name}),n.onLogout.then(function(){e.go("auth.login")},function(){e.go("auth.login"),r.addAlert({type:"danger",message:"Your session has expired. Please log in again."})}),t.logout=function(){n.logout()},t.$on("$stateChangeStart",function(o,r){t.authenticated=!!n.getToken(),"auth"!==r.name.substr(0,4)&&(t.authenticated||(o.preventDefault(),e.go("auth.register")))}),t.activeSideBar="apps",t.isActive=function(o){return-1!==e.current.name.indexOf(o)},t.back=function(){e.go(t.previousState,t.previousParams)}}]),angular.module("formioApp.services",[]).service("popupService",["$window",function(e){this.showPopup=function(o){return e.confirm(o)}}]);var app=angular.module("formioApp.controllers.app",[]);app.controller("AppIndexController",["$scope","$rootScope","Restangular",function(e,o,t){o.noBreadcrumb=!1,o.currentApp=!1,e.apps=t.all("app").getList().$object}]);var refreshUsers=function(e,o){return function(t){e.loadSubmissions({params:{"data.name":t}}).then(function(e){o.users=[],angular.forEach(e,function(e){o.users.push({id:e._id,name:e.data.name})})})}};app.controller("AppCreateController",["$scope","$rootScope","$state","Restangular","FormioAlerts","Formio",function(e,o,t,r,n,a){o.noBreadcrumb=!1,e.currentApp={},e.users=[],e.refreshUsers=refreshUsers(new a(o.userForm),e),e.saveApplication=function(){r.all("app").post(e.currentApp).then(function(e){n.addAlert({type:"success",message:"New application created!"}),t.go("app.view",{appId:e._id})},function(e){e.data.message&&-1!==e.data.message.indexOf("duplicate key error index")&&(e.data.errors.name={path:"name",message:"Application domain already exists. Please pick a different domain."}),n.onError(e)})}}]),app.controller("AppController",["$scope","$rootScope","$stateParams","Formio","FormioAlerts","$state",function(e,o,t,r,n,a){o.activeSideBar="apps",o.noBreadcrumb=!1,e.resourcesLoading=!0,e.resources=[],e.$on("pagination:loadPage",function(o){var t=o.targetScope.$parent.formType;e[t+"sLoading"]=!1,angular.element("#"+t+"-loader").hide()}),e.formsLoading=!0,e.forms=[],e.formio=new r("/app/"+t.appId),e.currentApp={_id:t.appId,access:[]},e.formio.loadApp().then(function(t){e.currentApp=t,o.currentApp=t}),e.saveApplication=function(){return e.currentApp._id?void e.formio.saveApp(e.currentApp).then(function(e){n.addAlert({type:"success",message:"Application saved."}),a.go("app.view",{appId:e._id})},n.onError.bind(n)):n.onError(new Error("No application found."))}}]),app.controller("AppEditController",["$scope","$rootScope","$state","Formio",function(e,o,t,r){o.noBreadcrumb=!1,e.users=[],e.refreshUsers=refreshUsers(new r(o.userForm),e)}]),app.controller("AppSettingsController",["$scope",function(e){e.active="email",e.subActive=""}]),app.controller("AppDeleteController",["$scope","$state","FormioAlerts",function(e,o,t){e.deleteApp=function(){e.currentApp&&e.currentApp._id&&e.formio.deleteApp().then(function(){t.addAlert({type:"success",message:"Application was deleted!"}),o.go("home")},t.onError.bind(t))}}]),angular.module("formioApp.controllers",["formioApp.controllers.form","formioApp.controllers.app","formioApp.controllers.team","formioApp.controllers.user","formioApp.controllers.import","formioApp.controllers.help"]);var app=angular.module("formioApp.controllers.form",["ngDialog","ui.sortable","ui.bootstrap.tabs","ui.bootstrap.tpls","ui.bootstrap.accordion","ngFormBuilder","formio","bgf.paginateAnything"]);app.config(["$stateProvider",function(e){e.state("app.form",{"abstract":!0,url:"/form/:formId",parent:"app",templateUrl:"views/form/form.html",controller:"FormController"}).state("app.form.view",{url:"",parent:"app.form",templateUrl:"views/form/form-view.html"}).state("app.form.edit",{url:"/edit",parent:"app.form",templateUrl:"views/form/form-edit.html"}).state("app.form.delete",{url:"/delete",parent:"app.form",controller:"FormDeleteController",templateUrl:"views/form/form-delete.html"}).state("app.form.createForm",{url:"/create/form",parent:"app",templateUrl:"views/form/form-edit.html",controller:"FormController",params:{formType:"form"}}).state("app.form.createResource",{url:"/create/resource",parent:"app",templateUrl:"views/form/form-edit.html",controller:"FormController",params:{formType:"resource"}}).state("app.form.formIndex",{url:"/form",parent:"app",template:'<form-list app="currentApp" form-type="\'form\'" num-per-page="25"></form-list>'}).state("app.form.resourceIndex",{url:"/form",parent:"app",template:'<form-list app="currentApp" form-type="\'resource\'" num-per-page="25"></form-list>'});var o={};o["app.form.submission"]={path:"/submission",id:"subId",indexController:"FormSubmissionsController",itemController:"FormSubmissionController",editController:"FormSubmissionEditController",deleteController:"FormSubmissionDeleteController"},o["app.form.action"]={path:"/action",id:"actionId",enabled:{view:!1},indexController:"FormActionIndexController",editController:"FormActionEditController",deleteController:"FormActionDeleteController"},angular.forEach(o,function(o,t){e.state(t,{"abstract":!0,url:o.path,parent:"app.form",template:"<div ui-view></div>"}).state(t+".index",{url:"",parent:t,templateUrl:"views/form"+o.path+"/index.html",controller:o.indexController}).state(t+".item",{"abstract":!0,url:"/:"+o.id,parent:t,controller:o.itemController,templateUrl:"views/form"+o.path+"/item.html"}).state(t+".item.view",{url:"",parent:t+".item",templateUrl:"views/form"+o.path+"/view.html",controller:o.viewController}).state(t+".item.edit",{url:"/edit",parent:t+".item",templateUrl:"views/form"+o.path+"/edit.html",controller:o.editController}).state(t+".item.delete",{url:"/delete",parent:t+".item",templateUrl:"views/form"+o.path+"/delete.html",controller:o.deleteController})}),e.state("app.form.action.add",{url:"/add/:actionName",parent:"app.form.action",templateUrl:"views/form/action/add.html",controller:"FormActionAddController",params:{actionInfo:null}})}]),app.directive("formList",function(){return{restrict:"E",replace:!0,templateUrl:"views/form/form-list.html",scope:{forms:"=",app:"=",formType:"=",numPerPage:"="},compile:function(e,o){o.numPerPage||(o.numPerPage=25)},controller:["$scope","$rootScope","AppConfig",function(e,o,t){o.activeSideBar="apps",o.noBreadcrumb=!1,e.formsPerPage=e.numPerPage,e.formsUrl=t.apiBase+"/app/"+e.app._id+"/form?type="+e.formType}]}}),app.controller("FormController",["$scope","$state","$stateParams","Formio","FormioAlerts","AppConfig",function(e,o,t,r,n,a){var i=function(e){return e.toLowerCase().replace(/ (.)/g,function(e,o){return o.toUpperCase()})};e.appId=t.appId,e.formId=t.formId,e.formUrl="/app/"+t.appId+"/form",e.formUrl+=t.formId?"/"+t.formId:"";var l=t.formType||"form";e.form={title:"",type:l,components:[],access:[]},e.$watch("form.title",function(){e.form.name=e.form.title?i(e.form.title):""}),e.formio=new r(e.formUrl);var s="000000000000000000000000";e.anonymous=!1;var p=function(){var o=!1;return e.form&&angular.forEach(e.form.access,function(t,r){t.id===s&&(e.anonymous=!0,o=r)}),o};e.onAnonymous=function(o){if(e.form)if(o)p()===!1&&e.form.access.push({id:s,name:"Anonymous"});else{var t=p();t!==!1&&e.form.access.splice(t,1)}},e.formio.loadForm().then(function(o){e.form=o,p()}),e.getSwaggerURL=function(){return a.appBase+"/form/"+e.form._id+"/spec.html?token="+r.getToken()},e.disableSubmissionHandler=e.$on("formSubmission",function(e,t){n.addAlert({type:"success",message:"New submission added!"}),t._id&&o.go("app.form.submission.item.view",{subId:t._id})}),e.saveForm=function(){e.formio.saveForm(e.form).then(function(e){var r=t.formId?"updated":"created";n.addAlert({type:"success",message:"Successfully "+r+" form!"}),o.go("app.form.view",{formId:e._id})},n.onError.bind(n))},e.deleteForm=function(){e.formio.deleteForm().then(function(){n.addAlert({type:"success",message:"Delete successful"}),o.go("app.form.index")},n.onError.bind(n))}}]),app.factory("FormioAlerts",["$rootScope",function(e){var o=[];return{addAlert:function(t){e.alerts.push(t),t.element?angular.element("#form-group-"+t.element).addClass("has-error"):o.push(t)},getAlerts:function(){var e=angular.copy(o);return o.length=0,o=[],e},onError:function t(e){if(e.message)this.addAlert({type:"danger",message:e.message,element:e.path});else{var o=e.hasOwnProperty("errors")?e.errors:e.data.errors;_.each(o,t.bind(this))}}}}]),app.controller("FormDeleteController",["$scope","$state","FormioAlerts",function(e,o,t){e.$on("delete",function(){t.addAlert({type:"success",message:"Form was deleted."}),o.go("app.view")}),e.$on("cancel",function(){o.go("app.form.view")}),e.$on("formError",function(e,o){t.onError(o)})}]),app.controller("FormActionIndexController",["$scope","$state","Formio","FormioAlerts",function(e,o,t,r){e.newAction={name:"",title:"Select an Action"},e.availableActions={},e.actions={},e.addAction=function(){e.newAction.name?o.go("app.form.action.add",{actionName:e.newAction.name,actionInfo:e.newAction}):r.addAlert({type:"danger",message:"You must add an action to continue.",element:"action-select"})},e.formio.loadActions().then(function(o){e.actions=o},r.onError.bind(r)),e.formio.availableActions().then(function(o){o[0].name||o.shift(),o.unshift(e.newAction),e.availableActions=o})}]);var loadActionInfo=function(e,o,t){e.actionUrl="",e.actionInfo=o.actionInfo||{settingsForm:{}},e.action={data:{settings:{}}},e.disableSubmissionHandler();var r=function(o,t){e.formio.availableActions().then(function(r){angular.forEach(r,function(r){r.name===o&&(e.actionInfo=_.merge(e.actionInfo,r),t&&t(e.actionInfo))})})},n=function(n){if(o.actionId){e.actionUrl=e.formio.formUrl+"/action/"+o.actionId;var a=new t(e.actionUrl);a.loadAction().then(function(o){e.action=_.merge(e.action,{data:o}),r(o.name)})}else n&&(e.action=_.merge(e.action,{data:n}),e.action.data.settings={})};!o.actionInfo&&o.actionName?r(o.actionName,function(e){n(e.defaults)}):n(e.actionInfo.defaults)};app.controller("FormActionAddController",["$scope","$stateParams","$state","FormioAlerts",function(e,o,t,r){loadActionInfo(e,o),e.$on("formSubmission",function(){r.addAlert({type:"success",message:"Action was created."}),t.go("app.form.action.index")})}]),app.controller("FormActionEditController",["$scope","$stateParams","$state","Formio","FormioAlerts",function(e,o,t,r,n){loadActionInfo(e,o,r),e.$on("formSubmission",function(){n.addAlert({type:"success",message:"Action was updated."}),t.go("app.form.action.index")})}]),app.controller("FormActionDeleteController",["$scope","$stateParams","$state","FormioAlerts",function(e,o,t,r){e.actionUrl=e.formio.formUrl+"/action/"+o.actionId,e.$on("delete",function(){r.addAlert({type:"success",message:"Action was deleted."}),t.go("app.form.action.index")})}]),app.controller("FormSubmissionsController",["$scope","$state",function(e,o){e.$on("submissionView",function(e,t){o.go("app.form.submission.item.view",{subId:t._id})}),e.$on("submissionEdit",function(e,t){o.go("app.form.submission.item.edit",{subId:t._id})}),e.$on("submissionDelete",function(e,t){o.go("app.form.submission.item.delete",{subId:t._id})})}]),app.controller("FormSubmissionController",["$scope","$state","$stateParams","Formio",function(e,o,t,r){e.submissionId=t.subId,e.submissionUrl=e.formUrl,e.submissionUrl+=t.subId?"/submission/"+t.subId:"",e.submissionData=r.submissionData,e.submission={},e.formio=new r(e.submissionUrl),e.formio.loadSubmission().then(function(o){e.submission=o})}]),app.controller("FormSubmissionEditController",["$scope","$state","FormioAlerts",function(e,o,t){e.$on("formSubmission",function(r,n){var a="put"===n.method?"updated":"created";t.addAlert({type:"success",message:"Submission was "+a+"."}),o.go("app.form.submission.index",{formId:e.formId})}),e.deleteSubmission=function(){e.formio.deleteSubmission().then(function(){o.go("app.form.submission.index",{formId:e.formId})},t.onError.bind(t))}}]),app.controller("FormSubmissionDeleteController",["$scope","$state","FormioAlerts",function(e,o,t){e.$on("delete",function(){t.addAlert({type:"success",message:"Submission was deleted."}),o.go("app.form.submission.index")}),e.$on("cancel",function(){o.go("app.form.submission.item.view")}),e.$on("formError",function(e,o){t.onError(o)})}]);var app=angular.module("formioApp.controllers.help",[]);app.controller("HelpIndexController",["$scope","$rootScope",function(e,o){o.activeSideBar="help",o.noBreadcrumb=!0}]);var app=angular.module("formioApp.controllers.import",[]);app.controller("ImportExportController",["$scope","$rootScope",function(e,o){o.activeSideBar="import",o.noBreadcrumb=!0}]);var app=angular.module("formioApp.controllers.team",[]);app.controller("TeamCreateController",["$scope","$state","FormioAlerts",function(e,o,t){e.$on("formSubmission",function(){t.addAlert({type:"success",message:"New team created!"}),o.go("home")})}]),app.controller("TeamController",["$scope","$stateParams","$rootScope","Formio",function(e,o,t,r){e.teamUrl=t.teamForm+"/submission/"+o.teamId,e.team={},e.formio=new r(e.teamUrl),e.formio.loadSubmission().then(function(o){e.team=o})}]),app.controller("TeamEditController",["$scope","$state",function(e,o){e.$on("formSubmission",function(){o.go("home")})}]),app.controller("TeamDeleteController",["$scope","$state","FormioAlerts",function(e,o,t){e.$on("delete",function(){t.addAlert({type:"success",message:"Team was deleted."}),o.go("home")})}]);var app=angular.module("formioApp.controllers.user",[]);app.controller("UserLoginController",["$scope","$state","$rootScope",function(e,o,t){e.$on("formSubmission",function(e,r){r&&(t.user=r,o.go("home"))})}]),app.controller("UserRegisterController",["$scope","$state","$rootScope",function(e,o,t){e.$on("formSubmission",function(e,r){r&&(t.user=r,o.go("home"))})}]);