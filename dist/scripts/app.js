"use strict";angular.module("formioApp",["ngSanitize","restangular","ui.router","ui.bootstrap.alert","ui.bootstrap.tpls","ui.select","angularMoment","formioApp.controllers","formioApp.services","formioApp.directives"]).config(["$stateProvider","$urlRouterProvider","FormioProvider","RestangularProvider",function(e,r,o,t){o.setBaseUrl("http://localhost:3000/api"),t.setBaseUrl("http://localhost:3000/api"),e.state("home",{url:"/?",templateUrl:"views/home/home.html",controller:"HomeController"}).state("app",{url:"/app/:appId",controller:"AppController",templateUrl:"views/app/app.html"}).state("createApp",{url:"/create/app",templateUrl:"views/app/create.html",controller:"AppCreateController"}).state("app.view",{url:"/view",parent:"app",templateUrl:"views/app/view.html"}).state("app.edit",{url:"/edit",parent:"app",templateUrl:"views/app/edit.html",controller:"AppEditController"}).state("app.delete",{url:"/delete",parent:"app",templateUrl:"views/app/delete.html",controller:"AppDeleteController"}).state("userIndex",{url:"/user",templateUrl:"views/user/index.html",controller:"UserIndexController"}).state("importExport",{url:"/import-export",templateUrl:"views/import/index.html",controller:"ImportExportController"}).state("help",{url:"/help",templateUrl:"views/help/index.html",controller:"HelpIndexController"}),r.otherwise("/")}]).controller("HomeController",["$scope","Restangular","$rootScope",function(e,r,o){o.activeSideBar="home",o.currentApp=null,e.apps=r.all("app").getList().$object,e.users=r.all("user").getList().$object}]).filter("trusted",["$sce",function(e){return function(r){return e.trustAsResourceUrl(r)}}]).run(["$state","$stateParams","$rootScope","FormioAlerts",function(e,r,o,t){e.go("home"),o.alerts=[],o.closeAlert=function(e){o.alerts.splice(e,1)},o.isActive=function(){for(var e=!0,r=arguments[0],o=1;o<arguments.length;o++){if(!r.hasOwnProperty(arguments[o])){e=!1;break}r=r[arguments[o]]}return e},o.$state=e,o.$stateParams=r,o.$on("$stateChangeSuccess",function(e,r,s,a,n){o.alerts=t.getAlerts(),o.previousState=a.name,o.previousParams=n,o.currentState=r.name}),o.activeSideBar="apps",o.back=function(){e.go(o.previousState,o.previousParams)}}]);var app=angular.module("formioApp.controllers.app",[]);app.controller("AppIndexController",["$scope","$rootScope","Restangular",function(e,r,o){r.noBreadcrumb=!1,r.currentApp=!1,e.apps=o.all("app").getList().$object}]),app.controller("AppCreateController",["$scope","$rootScope","$state","Restangular","FormioAlerts",function(e,r,o,t,s){r.noBreadcrumb=!1,e.app={},e.createApplication=function(){t.all("app").post(e.app).then(function(e){s.addAlert({type:"success",message:"New application created!"}),o.go("app.view",{appId:e._id})},s.onError.bind(s))}}]),app.controller("AppController",["$scope","$rootScope","$stateParams","Restangular",function(e,r,o,t){r.activeSideBar="apps",r.noBreadcrumb=!1,e.currentApp={_id:o.appId},t.one("app",o.appId).get().then(function(o){e.currentApp=o,r.currentApp=o})}]),angular.module("formioApp.controllers",["formioApp.controllers.resource","formioApp.controllers.app","formioApp.controllers.user","formioApp.controllers.import","formioApp.controllers.help"]).config(["ResourceProvider",function(e){var r=function(e){return e.toLowerCase().replace(/ (.)/g,function(e,r){return r.toUpperCase()})},o=function(e){e.$watch("resource.title",function(){e.resource.name=e.resource.title?r(e.resource.title):""})};e.register({title:"Form",name:"form",url:"/form",views:{create:"views/form/form.html",edit:"views/form/form.html"}}),e.register({title:"Resource",name:"resource",url:"/resource",onEdit:o,onCreate:o,views:{create:"views/resource/resource.html",edit:"views/resource/resource.html"}})}]);var app=angular.module("formioApp.controllers.help",[]);app.controller("HelpIndexController",["$scope","$rootScope",function(e,r){r.activeSideBar="help",r.noBreadcrumb=!0}]);var app=angular.module("formioApp.controllers.import",[]);app.controller("ImportExportController",["$scope","$rootScope",function(e,r){r.activeSideBar="import",r.noBreadcrumb=!0}]);var app=angular.module("formioApp.controllers.resource",["ngDialog","ui.sortable","ui.bootstrap.tabs","ui.bootstrap.tpls","ngFormBuilder","formio","bgf.paginateAnything"]);app.provider("Resource",["$stateProvider","RestangularProvider",function(e,r){var o={};return r.setRestangularFields({id:"_id"}),{register:function(r){var t=" resource-title=\"'"+r.title+"'\"";t+=" resource-name=\"'"+r.name+"'\"",o[r.name]=r,e.state("app.list"+r.title+"s",{url:r.url,parent:"app",template:"<resource-list"+t+"></resource-list>"}).state("app.view"+r.title,{url:r.url+"/:id",parent:"app",templateUrl:"views/resource/resource-view.html",controller:"ResourceViewController",params:{resource:r}}).state("app.edit"+r.title,{url:r.url+"/:id/edit",parent:"app",templateUrl:"views/resource/resource-edit.html",controller:"ResourceEditController",params:{resource:r}}).state("app.delete"+r.title,{url:r.url+"/:id/delete",parent:"app",templateUrl:"views/resource/resource-delete.html",controller:"ResourceDeleteController",params:{resource:r}}).state("app.create"+r.title,{url:"/create/"+r.name,parent:"app",templateUrl:"views/resource/resource-create.html",controller:"ResourceCreateController",params:{resource:r}}).state("app.api"+r.title,{url:r.url+"/:id/api",parent:"app",templateUrl:"views/resource/resource-api.html",controller:"ResourceAPIController",params:{resource:r}}).state("app.api"+r.title+".spec",{url:"/spec",parent:"app.api"+r.title,templateUrl:"views/resource/resource-api.spec.html",controller:"ResourceAPISpecController",params:{resource:r}}).state("app.api"+r.title+".embed",{url:"/embed",parent:"app.api"+r.title,templateUrl:"views/resource/resource-api.embed.html",controller:"ResourceAPIEmbedController",params:{resource:r}}).state("app.list"+r.title+"Submissions",{url:r.url+"/:id/submission",parent:"app",templateUrl:"views/resource/resource-submissions.html",controller:"ResourceSubmissionsController",params:{resource:r}}).state("app.view"+r.title+"Submission",{url:r.url+"/:id/submission/:subId",parent:"app",templateUrl:"views/resource/resource-submission-view.html",controller:"ResourceSubmissionViewController",params:{resource:r}}).state("app.edit"+r.title+"Submission",{url:r.url+"/:id/submission/:subId/edit",parent:"app",templateUrl:"views/resource/resource-submission-edit.html",controller:"ResourceSubmissionEditController",params:{resource:r}}).state("app.delete"+r.title+"Submission",{url:r.url+"/:id/submission/:subId/delete",parent:"app",templateUrl:"views/resource/resource-submission-delete.html",controller:"ResourceSubmissionDeleteController",params:{resource:r}})},$get:function(){return o}}}]),app.factory("FormioAlerts",["$rootScope",function(e){var r=[];return{addAlert:function(o){e.alerts.push(o),o.element?angular.element("#form-group-"+o.element).addClass("has-error"):r.push(o)},getAlerts:function(){var e=angular.copy(r);return r.length=0,r=[],e},onError:function(e){_.each(e.data.errors,function(e){this.addAlert({type:"danger",message:e.message,element:e.path})}.bind(this))}}}]),app.directive("resourceList",function(){return{restrict:"E",replace:!0,templateUrl:"views/resource/resource-list.html",scope:{app:"=",resourceTitle:"=",resourceName:"=",numPerPage:"="},compile:function(e,r){r.numPerPage||(r.numPerPage=25),r.resourceTitle||(r.resourceTitle="Resource"),r.resourceName||(r.resourceName="resource")},controller:["$scope","$rootScope","Restangular",function(e,r,o){r.activeSideBar="apps",r.noBreadcrumb=!1,e.resources=[],e.resourcesPerPage=e.numPerPage,e.resourceUrl=o.one("app",e.app._id).all(e.resourceName).getRestangularUrl(),e.resourceInfo={title:e.resourceTitle,name:e.resourceName}}]}}),app.controller("ResourceViewController",["$scope","$state","$stateParams","FormioAlerts","$location",function(e,r,o,t,s){e.nav={},e.nav[o.resource.name]={view:!0},e.resourceUrl=s.url(),e.resourceInfo=o.resource,e.resource={},e.$on("formLoad",function(r,o){e.resource=o}),e.$on("formSubmission",function(s,a){t.addAlert({type:"success",message:"New submission added!"}),r.go("app.view"+o.resource.title+"Submission",{id:e.resource._id,subId:a._id})})}]),app.controller("ResourceCreateController",["$scope","$state","$stateParams","Restangular","FormioAlerts",function(e,r,o,t,s){e.resourceName=o.resource.name,e.resource={title:"",components:[]},e.nav={},e.resourceInfo=o.resource,e.appId=o.appId,e.nav[o.resource.name]={edit:!0},e.resourceInfo.onCreate&&e.resourceInfo.onCreate(e,r,o,t,s),e.saveResource=function(){t.one("app",o.appId).all(o.resource.name).post(e.resource).then(function(e){s.addAlert({type:"success",message:"Successfully created form!"}),r.go("app.api"+o.resource.title,{id:e._id})},s.onError.bind(s))}}]),app.controller("ResourceEditController",["$scope","$state","$stateParams","Restangular","FormioAlerts",function(e,r,o,t,s){e.resource={},e.nav={},e.resourceInfo=o.resource,e.appId=o.appId,e.nav[o.resource.name]={edit:!0},e.resourceInfo.onEdit&&e.resourceInfo.onEdit(e,r,o,t,s),t.one("app",o.appId).one(o.resource.name,o.id).get().then(function(t){e.resource=t,e.saveResource=function(){e.resource.save().then(function(){s.addAlert({type:"success",message:"Saved form successfull."}),r.go("app.view"+o.resource.title,{id:t._id})},s.onError.bind(s))}})}]),app.controller("ResourceDeleteController",["$scope","$state","$stateParams","Restangular","FormioAlerts",function(e,r,o,t,s){e.nav={},e.nav[o.resource.name]={"delete":!0},e.resourceInfo=o.resource,e.resource=t.one("app",o.appId).one(o.resource.name,o.id).get().$object,e.deleteResource=function(){e.resource.remove().then(function(){s.addAlert({type:"success",message:"Delete successfull."}),r.go("app.list"+o.resource.title+"s")},s.onError.bind(s))}}]),app.controller("ResourceAPIController",["$scope","$state","$stateParams","Restangular",function(e,r,o,t){e.resource={_id:o.id},t.one("app",o.appId).one(o.resource.name,o.id).get().then(function(r){e.resource=r}),e.resourceInfo=o.resource,e.nav={},e.nav[o.resource.name]={api:!0},r.transitionTo("app.api"+o.resource.title+".spec",{appId:o.appId,id:o.id})}]),app.controller("ResourceAPISpecController",["$stateParams","$scope",function(e,r){r.getSwaggerURL=function(){return"http://localhost:3000/form/"+r.resource._id+"/spec.html"},r.nav={},r.nav[e.resource.name]={api:{spec:!0}}}]),app.controller("ResourceAPIEmbedController",["$stateParams","$scope",function(e,r){r.nav={},r.nav[e.resource.name]={api:{embed:!0}}}]),app.controller("ResourceSubmissionsController",["$scope","$state","$stateParams","$location",function(e,r,o,t){e.nav={},e.resourceInfo=o.resource,e.nav[o.resource.name]={submission:!0},e.resourceUrl=t.url().replace("/submission",""),e.resource={},e.$on("formLoad",function(r,o){e.resource=o}),e.$on("submissionView",function(o,t){r.go("app.view"+e.resourceInfo.title+"Submission",{id:e.resource._id,subId:t._id})}),e.$on("submissionEdit",function(o,t){r.go("app.edit"+e.resourceInfo.title+"Submission",{id:e.resource._id,subId:t._id})}),e.$on("submissionDelete",function(o,t){r.go("app.delete"+e.resourceInfo.title+"Submission",{id:e.resource._id,subId:t._id})})}]),app.controller("ResourceSubmissionViewController",["$scope","$stateParams","Formio","Restangular",function(e,r,o,t){e.nav={form:{submission:{view:!0}}},e.resourceInfo=r.resource,e.submissionData=o.submissionData,e.submission=t.one("app",r.appId).one(r.resource.name,r.id).one("submission",r.subId).get().$object,e.resource=t.one("app",r.appId).one(r.resource.name,r.id).get().$object}]),app.controller("ResourceSubmissionEditController",["$scope","$state","$stateParams","FormioAlerts","$location",function(e,r,o,t,s){e.nav={},e.nav[o.resource.name]={submission:{edit:!0}},e.resourceInfo=o.resource,e.submissionUrl=s.url(),e.resource={},e.submission={},e.$on("formLoad",function(r,o){e.resource=o}),e.$on("submissionLoad",function(r,o){e.submission=o}),e.$on("formSubmission",function(e,s){var a="put"===s.method?"updated":"created";t.addAlert({type:"success",message:"Submission was "+a+"."}),r.go("app.list"+o.resource.title+"Submissions",{id:o.id})}),e.deleteSubmission=function(){e.submission.remove().then(function(){r.go("app.list"+o.resource.title+"Submissions",{id:o.id})},t.onError.bind(t))}}]),app.controller("ResourceSubmissionDeleteController",["$scope","$state","$stateParams","FormioAlerts","$location",function(e,r,o,t,s){e.nav={},e.nav[o.resource.name]={submission:{"delete":!0}},e.resource={_id:o.id},e.submissionUrl=s.url(),e.resourceInfo=o.resource,e.$on("delete",function(){t.addAlert({type:"success",message:"Submission was deleted."}),r.go("app.list"+o.resource.title+"Submissions",{id:o.id})}),e.$on("cancel",function(){r.go("app.view"+o.resource.title+"Submission",{id:o.id,subId:o.subId})}),e.$on("formError",function(e,r){t.onError(r)})}]);var app=angular.module("formioApp.controllers.user",[]);app.controller("UserIndexController",["$scope","$rootScope",function(e,r){r.activeSideBar="user",r.noBreadcrumb=!0}]),angular.module("formioApp.directives",[]).directive("logo",function(){return{restrict:"E",scope:{size:"@"},templateUrl:"views/partials/logo.html"}}),angular.module("formioApp.services",[]).service("popupService",["$window",function(e){this.showPopup=function(r){return e.confirm(r)}}]);