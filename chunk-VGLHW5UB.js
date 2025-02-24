import{a as K}from"./chunk-HLC5ZJ4Y.js";import{a as Ce,b as xe,c as he,d as ve,e as ye,f as Me,g as be,h as Se,i as we,j as Ee,k as Oe,l as Pe,m as Ie,n as ke,o as ze}from"./chunk-I7AWFKUK.js";import{a as ue,b as ge,c as fe,d as _e}from"./chunk-SC34O37M.js";import{b as se,c as pe,f as me,g as de,s as W,t as R,u as G}from"./chunk-NKPZFQ4M.js";import{a as B,b as V,c as D,f as H,h as N,j as Q}from"./chunk-WJCE3IO6.js";import{a as F,b as re,c as A,d as ae,e as ce,f as q}from"./chunk-MEURHACS.js";import{e as te,ea as oe,f as ne,h as ie,ja as L,ka as le,l as U,la as j}from"./chunk-IOL6GJYU.js";import"./chunk-HU7WFQWJ.js";import{$b as y,Eb as i,Ec as z,Fb as n,Fc as ee,Gb as k,Hb as h,Hc as T,Ic as J,Kb as g,Mb as s,Wb as o,Xb as C,Ya as P,Yb as d,Zb as Z,_a as c,_b as v,aa as Y,ac as M,db as x,fc as S,gc as w,kb as I,la as f,lb as $,ma as _,ob as u,vb as m,yb as b}from"./chunk-GQ4PJ4JO.js";function Qe(a,t){if(a&1){let e=h();i(0,"mat-card",22),g("click",function(){let l=f(e).$implicit,p=s();return _(p.navigateToConcept(l.id))}),i(1,"mat-card-header")(2,"mat-card-title"),o(3),n(),i(4,"mat-chip-set")(5,"mat-chip")(6,"mat-icon"),o(7),n(),o(8),S(9,"titlecase"),n(),i(10,"mat-chip")(11,"mat-icon"),o(12),n(),o(13),S(14,"titlecase"),n()()(),i(15,"mat-card-content")(16,"p"),o(17),n(),i(18,"div",23)(19,"span",24)(20,"mat-icon"),o(21,"quiz"),n(),o(22),n(),i(23,"span",24)(24,"mat-icon"),o(25,"code"),n(),o(26),n()()(),i(27,"mat-card-actions")(28,"button",25)(29,"mat-icon"),o(30,"school"),n(),o(31," Learn More "),n()()()}if(a&2){let e=t.$implicit,r=s();c(3),C(e.title),c(2),b(e.difficulty),c(2),C(r.getDifficultyIcon(e.difficulty)),c(),d(" ",w(9,10,e.difficulty)," "),c(4),C(r.getCategoryIcon(e.category)),c(),d(" ",w(14,12,e.category)," "),c(4),C(e.description),c(5),d(" ",e.quiz.length," questions "),c(4),d(" ",e.interactiveExamples.length||0," examples ")}}var E=class a{constructor(t,e){this.conceptService=t;this.router=e}concepts=[];filteredConcepts=[];searchQuery="";selectedDifficulty="";selectedCategory="";sortBy="title";ngOnInit(){this.conceptService.getConcepts("javascript").subscribe(t=>{this.concepts=t,this.filteredConcepts=t,this.sortConcepts()})}filterConcepts(){this.filteredConcepts=this.concepts.filter(t=>{let e=!this.searchQuery||t.title.toLowerCase().includes(this.searchQuery.toLowerCase())||t.description.toLowerCase().includes(this.searchQuery.toLowerCase()),r=!this.selectedDifficulty||t.difficulty===this.selectedDifficulty,l=!this.selectedCategory||t.category===this.selectedCategory;return e&&r&&l}),this.sortConcepts()}sortConcepts(){this.filteredConcepts.sort((t,e)=>{switch(this.sortBy){case"title":return t.title.localeCompare(e.title);case"difficulty":let r={beginner:1,intermediate:2,advanced:3};return r[t.difficulty]-r[e.difficulty];case"category":return t.category.localeCompare(e.category);default:return 0}})}navigateToConcept(t){this.router.navigate(["/javascript/concept",t])}getDifficultyIcon(t){switch(t){case"beginner":return"school";case"intermediate":return"trending_up";case"advanced":return"psychology";default:return"help"}}getCategoryIcon(t){switch(t){case"fundamentals":return"school";case"functions":return"functions";case"objects":return"data_object";case"async":return"sync";case"es6":return"code";default:return"help"}}static \u0275fac=function(e){return new(e||a)(x(K),x(ie))};static \u0275cmp=I({type:a,selectors:[["app-javascript-list"]],decls:53,vars:6,consts:[[1,"list-container"],[1,"list-header"],[1,"filters"],["appearance","outline",1,"search-field"],["matInput","","placeholder","Search by title or description",3,"ngModelChange","ngModel"],["matSuffix",""],["appearance","outline"],[3,"ngModelChange","ngModel"],["value",""],["value","beginner"],["value","intermediate"],["value","advanced"],["value","fundamentals"],["value","functions"],["value","objects"],["value","async"],["value","es6"],["value","title"],["value","difficulty"],["value","category"],[1,"concepts-grid"],["class","concept-card",3,"click",4,"ngFor","ngForOf"],[1,"concept-card",3,"click"],[1,"concept-meta"],[1,"meta-item"],["mat-button","","color","primary"]],template:function(e,r){e&1&&(i(0,"div",0)(1,"header",1)(2,"h1"),o(3),n(),i(4,"p"),o(5,"Master JavaScript with interactive examples, live coding, and quizzes"),n()(),i(6,"div",2)(7,"mat-form-field",3)(8,"mat-label"),o(9,"Search concepts"),n(),i(10,"input",4),M("ngModelChange",function(p){return y(r.searchQuery,p)||(r.searchQuery=p),p}),g("ngModelChange",function(){return r.filterConcepts()}),n(),i(11,"mat-icon",5),o(12,"search"),n()(),i(13,"mat-form-field",6)(14,"mat-label"),o(15,"Difficulty"),n(),i(16,"mat-select",7),M("ngModelChange",function(p){return y(r.selectedDifficulty,p)||(r.selectedDifficulty=p),p}),g("ngModelChange",function(){return r.filterConcepts()}),i(17,"mat-option",8),o(18,"All levels"),n(),i(19,"mat-option",9),o(20,"Beginner"),n(),i(21,"mat-option",10),o(22,"Intermediate"),n(),i(23,"mat-option",11),o(24,"Advanced"),n()()(),i(25,"mat-form-field",6)(26,"mat-label"),o(27,"Category"),n(),i(28,"mat-select",7),M("ngModelChange",function(p){return y(r.selectedCategory,p)||(r.selectedCategory=p),p}),g("ngModelChange",function(){return r.filterConcepts()}),i(29,"mat-option",8),o(30,"All categories"),n(),i(31,"mat-option",12),o(32,"Fundamentals"),n(),i(33,"mat-option",13),o(34,"Functions"),n(),i(35,"mat-option",14),o(36,"Objects"),n(),i(37,"mat-option",15),o(38,"Async Programming"),n(),i(39,"mat-option",16),o(40,"ES6+ Features"),n()()(),i(41,"mat-form-field",6)(42,"mat-label"),o(43,"Sort by"),n(),i(44,"mat-select",7),M("ngModelChange",function(p){return y(r.sortBy,p)||(r.sortBy=p),p}),g("ngModelChange",function(){return r.sortConcepts()}),i(45,"mat-option",17),o(46,"Title"),n(),i(47,"mat-option",18),o(48,"Difficulty"),n(),i(49,"mat-option",19),o(50,"Category"),n()()()(),i(51,"div",20),u(52,Qe,32,14,"mat-card",21),n()()),e&2&&(c(3),d("JavaScript Concepts (",r.filteredConcepts.length,")"),c(7),v("ngModel",r.searchQuery),c(6),v("ngModel",r.selectedDifficulty),c(12),v("ngModel",r.selectedCategory),c(16),v("ngModel",r.sortBy),c(8),m("ngForOf",r.filteredConcepts))},dependencies:[J,z,T,Q,D,H,N,q,F,ae,A,ce,re,j,L,V,B,G,W,R,ge,ue,me,se,pe,_e,fe,oe,de],styles:[".list-container[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto;padding:2rem}.list-container[_ngcontent-%COMP%]   .list-header[_ngcontent-%COMP%]{text-align:center;margin-bottom:3rem}.list-container[_ngcontent-%COMP%]   .list-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:2.5rem;color:#333;margin-bottom:1rem}.list-container[_ngcontent-%COMP%]   .list-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:1.2rem;color:#666}.list-container[_ngcontent-%COMP%]   .filters[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem}.list-container[_ngcontent-%COMP%]   .filters[_ngcontent-%COMP%]   .search-field[_ngcontent-%COMP%]{grid-column:1/-1}.list-container[_ngcontent-%COMP%]   .filters[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{width:100%}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]{cursor:pointer;transition:transform .2s ease-in-out,box-shadow .2s ease-in-out}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 4px 20px #0000001a}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]{flex-direction:column;align-items:flex-start;gap:1rem;margin-bottom:1rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%]{font-size:1.5rem;color:#333}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#666;margin-bottom:1rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .concept-meta[_ngcontent-%COMP%]{display:flex;gap:1rem;color:#666}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .concept-meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .concept-meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:1.2rem;width:1.2rem;height:1.2rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]{padding:1rem;border-top:1px solid #eee}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-chip.beginner[_ngcontent-%COMP%]{background-color:#4caf50;color:#fff}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-chip.intermediate[_ngcontent-%COMP%]{background-color:#ff9800;color:#fff}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]   .concept-card[_ngcontent-%COMP%]   mat-chip.advanced[_ngcontent-%COMP%]{background-color:#f44336;color:#fff}@media (max-width: 768px){.list-container[_ngcontent-%COMP%]{padding:1rem}.list-container[_ngcontent-%COMP%]   .list-header[_ngcontent-%COMP%]{margin-bottom:2rem}.list-container[_ngcontent-%COMP%]   .list-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:2rem}.list-container[_ngcontent-%COMP%]   .concepts-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}"]})};function We(a,t){if(a&1&&(i(0,"div",42)(1,"strong"),o(2,"Result:"),n(),k(3,"div",10),n()),a&2){let e=s().$implicit,r=s(3);c(3),m("innerHTML",r.sanitizeHtml(e.result),P)}}function Re(a,t){if(a&1){let e=h();i(0,"mat-expansion-panel")(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"mat-icon"),o(4,"code"),n(),o(5),n(),i(6,"mat-panel-description"),o(7," Try it yourself! "),n()(),i(8,"div",39)(9,"div",16)(10,"span"),o(11,"Code:"),n(),i(12,"button",40),g("click",function(){let l=f(e).index,p=s(3);return _(p.tryExample(l))}),i(13,"mat-icon"),o(14,"play_arrow"),n()()(),i(15,"pre"),k(16,"code",10),n(),u(17,We,4,1,"div",41),n()()}if(a&2){let e=t.$implicit,r=t.index,l=s(3);c(5),d(" Interactive Example ",r+1," "),c(11),m("innerHTML",l.highlightCode(e.code),P),c(),m("ngIf",e.result)}}function Ge(a,t){if(a&1&&(i(0,"mat-accordion",37),u(1,Re,18,3,"mat-expansion-panel",38),n()),a&2){let e=s(2);c(),m("ngForOf",e.content.interactiveExamples)}}function Ke(a,t){if(a&1&&(i(0,"li")(1,"mat-icon"),o(2,"check_circle"),n(),o(3),n()),a&2){let e=t.$implicit;c(3),d(" ",e," ")}}function Ye(a,t){if(a&1&&(i(0,"div",43)(1,"h3")(2,"mat-icon"),o(3,"lightbulb"),n(),o(4," Key Points "),n(),i(5,"ul"),u(6,Ke,4,1,"li",38),n()()),a&2){let e=s(2);c(6),m("ngForOf",e.content.keyPoints)}}function $e(a,t){if(a&1&&(i(0,"div",44),o(1),n()),a&2){let e=t.$implicit;c(),C(e)}}function Ue(a,t){if(a&1&&(i(0,"div",47)(1,"mat-icon",48),o(2,"error"),n(),i(3,"span"),o(4),n()()),a&2){let e=t.$implicit;c(4),Z("Line ",e.line,": ",e.message,"")}}function Xe(a,t){if(a&1&&(i(0,"div",45),u(1,Ue,5,2,"div",46),n()),a&2){let e=s(2);c(),m("ngForOf",e.syntaxErrors)}}function Ze(a,t){if(a&1&&(i(0,"div",49)(1,"mat-icon"),o(2),n(),i(3,"pre"),o(4),n()()),a&2){let e=t.$implicit,r=s(2);b(e.type),c(2),C(r.getLogIcon(e.type)),c(2),C(e.message)}}function et(a,t){if(a&1){let e=h();i(0,"div",50)(1,"h3"),o(2,"Quiz Results"),n(),i(3,"p"),o(4),n(),i(5,"button",51),g("click",function(){f(e);let l=s(2);return _(l.resetQuiz())}),o(6,"Retake Quiz"),n()()}if(a&2){let e=s(2);c(4),d("Score: ",e.quizScore,"%")}}function tt(a,t){if(a&1){let e=h();i(0,"button",56),g("click",function(){let l=f(e).index,p=s().index,Fe=s(2);return _(Fe.checkAnswer(p,l))}),o(1),n()}if(a&2){let e=t.$implicit,r=t.index,l=s().index,p=s(2);m("disabled",p.quizComplete)("color",p.getAnswerColor(l,r)),c(),d(" ",e," ")}}function nt(a,t){if(a&1&&(i(0,"p",59),o(1),n()),a&2){let e=s(2).index,r=s(2);c(),d(" The correct answer is: ",r.content.quiz[e].options[r.content.quiz[e].correctAnswer]," ")}}function it(a,t){if(a&1&&(i(0,"div",57)(1,"p"),o(2),n(),u(3,nt,2,1,"p",58),n()),a&2){let e=s().index,r=s(2);c(),b(r.isAnswerCorrect(e)?"correct":"incorrect"),c(),d(" ",r.isAnswerCorrect(e)?"\u2713 Correct!":"\u2717 Incorrect"," "),c(),m("ngIf",!r.isAnswerCorrect(e))}}function ot(a,t){if(a&1&&(i(0,"mat-card",52)(1,"mat-card-content")(2,"h3"),o(3),n(),i(4,"p"),o(5),n(),i(6,"div",53),u(7,tt,2,3,"button",54),n(),u(8,it,4,4,"div",55),n()()),a&2){let e=t.$implicit,r=t.index,l=s(2);c(3),d("Question ",r+1,""),c(2),C(e.question),c(2),m("ngForOf",e.options),c(),m("ngIf",l.userAnswers[r]!==void 0)}}function rt(a,t){if(a&1){let e=h();i(0,"div",60)(1,"button",61),g("click",function(){f(e);let l=s(2);return _(l.completeQuiz())}),o(2," Submit Quiz "),n()()}}function at(a,t){if(a&1){let e=h();i(0,"div",3)(1,"header",4)(2,"div",5)(3,"h1"),o(4),n(),i(5,"div",6)(6,"mat-chip-set")(7,"mat-chip")(8,"mat-icon"),o(9),n(),o(10),S(11,"titlecase"),n(),i(12,"mat-chip")(13,"mat-icon"),o(14),n(),o(15),S(16,"titlecase"),n()()(),i(17,"p"),o(18),n()()(),i(19,"mat-tab-group")(20,"mat-tab",7)(21,"div",8)(22,"mat-card")(23,"mat-card-content")(24,"div",9),k(25,"div",10),u(26,Ge,2,1,"mat-accordion",11)(27,Ye,7,1,"div",12),n()()()()(),i(28,"mat-tab",13)(29,"div",8)(30,"mat-card")(31,"mat-card-content")(32,"div",14)(33,"div",15)(34,"div",16)(35,"h3"),o(36,"JavaScript Code"),n(),i(37,"div",17)(38,"button",18),g("click",function(){f(e);let l=s();return _(l.copyCode())}),i(39,"mat-icon"),o(40,"content_copy"),n()(),i(41,"button",19),g("click",function(){f(e);let l=s();return _(l.resetCode())}),i(42,"mat-icon"),o(43,"restart_alt"),n()(),i(44,"button",20),g("click",function(){f(e);let l=s();return _(l.runCode())}),i(45,"mat-icon"),o(46,"play_arrow"),n()(),i(47,"button",21)(48,"mat-icon",22),o(49),n()()()(),i(50,"div",23)(51,"div",24),u(52,$e,2,1,"div",25),n(),i(53,"textarea",26,0),M("ngModelChange",function(l){f(e);let p=s();return y(p.currentCode,l)||(p.currentCode=l),_(l)}),g("ngModelChange",function(){f(e);let l=s();return _(l.onCodeChange())})("scroll",function(l){f(e);let p=s();return _(p.syncScroll(l))}),o(55,"                      "),n()(),u(56,Xe,2,1,"div",27),n(),i(57,"div",28)(58,"div",29)(59,"h3"),o(60,"Console Output"),n(),i(61,"button",30),g("click",function(){f(e);let l=s();return _(l.clearConsole())}),i(62,"mat-icon"),o(63,"clear_all"),n()()(),i(64,"div",31,1),u(66,Ze,5,4,"div",32),n()()()()()()(),i(67,"mat-tab",33)(68,"div",8),u(69,et,7,1,"div",34)(70,ot,9,4,"mat-card",35)(71,rt,3,0,"div",36),n()()()()}if(a&2){let e=s();c(4),C(e.content.title),c(3),b(e.content.difficulty),c(2),C(e.getDifficultyIcon(e.content.difficulty)),c(),d(" ",w(11,23,e.content.difficulty)," "),c(4),C(e.getCategoryIcon(e.content.category)),c(),d(" ",w(16,25,e.content.category)," "),c(3),C(e.content.description),c(7),m("innerHTML",e.sanitizedExplanation,P),c(),m("ngIf",e.content.interactiveExamples),c(),m("ngIf",e.content.keyPoints),c(20),m("matBadge",e.syntaxErrors.length)("matBadgeHidden",!e.syntaxErrors.length)("matTooltip",e.syntaxErrors.length?"Syntax errors found":"No syntax errors"),c(),m("color",e.syntaxErrors.length?"warn":"primary"),c(),d(" ",e.syntaxErrors.length?"error":"check_circle"," "),c(3),m("ngForOf",e.getLineNumbers()),c(),v("ngModel",e.currentCode),c(3),m("ngIf",e.syntaxErrors.length),c(10),m("ngForOf",e.consoleMessages),c(3),m("ngIf",e.quizComplete),c(),m("ngForOf",e.content.quiz),c(),m("ngIf",!e.quizComplete&&e.allQuestionsAnswered)}}var O=class a{constructor(t,e,r,l){this.route=t;this.conceptService=e;this.sanitizer=r;this.snackBar=l}content=null;userAnswers=[];currentCode="";sanitizedExplanation="";quizComplete=!1;quizScore=0;syntaxErrors=[];consoleMessages=[];ngOnInit(){let t=this.route.snapshot.paramMap.get("id");t&&this.conceptService.getConcept(t).subscribe(e=>{e?(this.content=e,e.explanation&&(this.sanitizedExplanation=this.sanitizer.bypassSecurityTrustHtml(e.explanation.replace(/</g,"&lt;").replace(/>/g,"&gt;"))),this.currentCode=e.example||"",setTimeout(()=>{Prism.highlightAll()})):console.error("Concept not found")})}getLineNumbers(){if(!this.currentCode)return[1];let t=this.currentCode.split(`
`).length;return Array.from({length:t},(e,r)=>r+1)}syncScroll(t){let e=t.target,r=e.previousElementSibling;r.scrollTop=e.scrollTop}onCodeChange(){this.checkSyntax()}checkSyntax(){this.syntaxErrors=[];try{new Function(this.currentCode)}catch(t){let e=t.message.match(/line (\d+)/),r=e?parseInt(e[1],10):1;this.syntaxErrors.push({line:r,message:t.message})}}runCode(){if(this.syntaxErrors.length>0){this.snackBar.open("Please fix syntax errors before running the code","Close",{duration:3e3});return}let t={log:e=>this.addConsoleOutput("log",e),info:e=>this.addConsoleOutput("info",e),warn:e=>this.addConsoleOutput("warn",e),error:e=>this.addConsoleOutput("error",e)};try{let e=`
        return (function() {
          const console = arguments[0];
          ${this.currentCode}
        })
      `;new Function(e)()(t)}catch(e){this.addConsoleOutput("error",e.message)}}addConsoleOutput(t,e){this.consoleMessages.push({type:t,message:this.formatConsoleMessage(e)})}formatConsoleMessage(t){return typeof t=="object"?JSON.stringify(t,null,2):String(t)}clearConsole(){this.consoleMessages=[]}getLogIcon(t){switch(t){case"info":return"info";case"warn":return"warning";case"error":return"error";default:return"terminal"}}highlightCode(t){return this.sanitizer.bypassSecurityTrustHtml(Prism.highlight(t,Prism.languages.javascript,"javascript"))}sanitizeHtml(t){return this.sanitizer.bypassSecurityTrustHtml(t)}tryExample(t){if(this.content?.interactiveExamples){let e=this.content.interactiveExamples[t];this.currentCode=e.code,this.checkSyntax()}}getCategoryIcon(t){switch(t){case"fundamentals":return"school";case"functions":return"functions";case"objects":return"data_object";case"async":return"sync";case"es6":return"code";default:return"help"}}getDifficultyIcon(t){switch(t){case"beginner":return"school";case"intermediate":return"trending_up";case"advanced":return"psychology";default:return"help"}}copyCode(){navigator.clipboard.writeText(this.currentCode),this.snackBar.open("Code copied to clipboard!","Close",{duration:2e3})}resetCode(){this.content&&(this.currentCode=this.content.example,this.checkSyntax())}checkAnswer(t,e){this.quizComplete||(this.userAnswers[t]=e)}isAnswerCorrect(t){return this.content?this.content.quiz[t].correctAnswer===this.userAnswers[t]:!1}get allQuestionsAnswered(){return this.content?this.userAnswers.length===this.content.quiz.length:!1}completeQuiz(){this.quizComplete=!0,this.calculateQuizScore()}resetQuiz(){this.userAnswers=[],this.quizComplete=!1,this.quizScore=0}calculateQuizScore(){if(!this.content)return;let t=this.userAnswers.reduce((e,r,l)=>e+(this.isAnswerCorrect(l)?1:0),0);this.quizScore=Math.round(t/this.content.quiz.length*100)}getAnswerColor(t,e){return this.userAnswers[t]===void 0?null:this.content&&this.content.quiz[t].correctAnswer===e?"primary":this.userAnswers[t]===e?"warn":null}static \u0275fac=function(e){return new(e||a)(x(ne),x(K),x(te),x(ve))};static \u0275cmp=I({type:a,selectors:[["app-javascript-concept"]],decls:1,vars:1,consts:[["codeEditor",""],["consoleContainer",""],["class","concept-container",4,"ngIf"],[1,"concept-container"],[1,"concept-header"],[1,"header-content"],[1,"concept-meta"],["label","Explanation"],[1,"tab-content"],[1,"explanation-content"],[3,"innerHTML"],["class","interactive-examples",4,"ngIf"],["class","key-points",4,"ngIf"],["label","Example"],[1,"example-container"],[1,"code-section"],[1,"code-header"],[1,"code-actions"],["mat-icon-button","","matTooltip","Copy to clipboard",3,"click"],["mat-icon-button","","matTooltip","Reset code",3,"click"],["mat-icon-button","","matTooltip","Run code",3,"click"],["mat-icon-button","","matBadgeColor","warn",3,"matBadge","matBadgeHidden","matTooltip"],[3,"color"],[1,"code-editor"],[1,"line-numbers"],["class","line-number",4,"ngFor","ngForOf"],["rows","10","spellcheck","false",3,"ngModelChange","scroll","ngModel"],["class","syntax-errors",4,"ngIf"],[1,"output-section"],[1,"output-header"],["mat-icon-button","","matTooltip","Clear console",3,"click"],[1,"console-output"],["class","log-entry",3,"class",4,"ngFor","ngForOf"],["label","Quiz"],["class","quiz-header",4,"ngIf"],["class","quiz-card",4,"ngFor","ngForOf"],["class","quiz-actions",4,"ngIf"],[1,"interactive-examples"],[4,"ngFor","ngForOf"],[1,"mini-editor"],["mat-icon-button","","matTooltip","Try this example",3,"click"],["class","example-result",4,"ngIf"],[1,"example-result"],[1,"key-points"],[1,"line-number"],[1,"syntax-errors"],["class","error",4,"ngFor","ngForOf"],[1,"error"],["color","warn"],[1,"log-entry"],[1,"quiz-header"],["mat-button","","color","primary",3,"click"],[1,"quiz-card"],[1,"options"],["mat-button","",3,"disabled","color","click",4,"ngFor","ngForOf"],["class","answer-feedback",4,"ngIf"],["mat-button","",3,"click","disabled","color"],[1,"answer-feedback"],["class","explanation",4,"ngIf"],[1,"explanation"],[1,"quiz-actions"],["mat-raised-button","","color","primary",3,"click"]],template:function(e,r){e&1&&u(0,at,72,27,"div",2),e&2&&m("ngIf",r.content)},dependencies:[J,z,ee,T,Q,D,H,N,q,F,A,j,L,le,V,B,he,Ce,xe,G,W,R,ye,be,Me,Ie,Pe,Se,we,Oe,Ee,ze,ke],styles:[`.concept-container{max-width:1000px;margin:0 auto;padding:2rem}.concept-container .concept-header{text-align:center;margin-bottom:2rem}.concept-container .concept-header .header-content{margin-bottom:1rem}.concept-container .concept-header h1{font-size:2.5rem;color:#333;margin-bottom:1rem}.concept-container .concept-header p{font-size:1.2rem;color:#666}.concept-container .concept-header .concept-meta{display:flex;justify-content:center;margin-bottom:1rem}.concept-container .explanation-content .interactive-examples{margin-top:2rem}.concept-container .explanation-content .interactive-examples .mini-editor{margin-top:1rem}.concept-container .explanation-content .interactive-examples .mini-editor .code-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}.concept-container .explanation-content .interactive-examples .mini-editor pre{background-color:#272822;padding:1rem;border-radius:4px;margin:0}.concept-container .explanation-content .interactive-examples .mini-editor .example-result{margin-top:1rem;padding:1rem;background-color:#f5f5f5;border-radius:4px}.concept-container .explanation-content .key-points{margin-top:2rem;padding:1rem;background-color:#e3f2fd;border-radius:4px}.concept-container .explanation-content .key-points h3{display:flex;align-items:center;gap:.5rem;color:#1976d2;margin-top:0}.concept-container .explanation-content .key-points ul{list-style:none;padding:0;margin:0}.concept-container .explanation-content .key-points ul li{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.concept-container .explanation-content .key-points ul li mat-icon{color:#4caf50;font-size:1.2rem}.concept-container .tab-content{padding:2rem 0}.concept-container .tab-content pre{margin:0;border-radius:4px}.concept-container .tab-content code{font-family:Fira Code,monospace;font-size:.9rem}.concept-container .example-container{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1rem}.concept-container .example-container .code-section{background-color:#272822;border-radius:4px}.concept-container .example-container .code-section .code-header{display:flex;justify-content:space-between;align-items:center;padding:.5rem 1rem;background-color:#1e1f1c;border-radius:4px 4px 0 0}.concept-container .example-container .code-section .code-header h3{color:#f8f8f2;margin:0}.concept-container .example-container .code-section .code-header .code-actions{display:flex;gap:.5rem}.concept-container .example-container .code-section .code-header button{color:#f8f8f2}.concept-container .example-container .code-section .code-editor{padding:1rem;display:flex;gap:1rem}.concept-container .example-container .code-section .code-editor .line-numbers{-webkit-user-select:none;user-select:none;text-align:right;color:#75715e;padding-right:.5rem;border-right:1px solid #3c3d37}.concept-container .example-container .code-section .code-editor .line-numbers .line-number{font-family:Fira Code,monospace;font-size:.9rem;line-height:1.5}.concept-container .example-container .code-section .code-editor textarea{flex:1;min-height:300px;background-color:#272822;color:#f8f8f2;border:none;font-family:Fira Code,monospace;font-size:.9rem;resize:vertical;padding:0 .5rem;outline:none;line-height:1.5}.concept-container .example-container .code-section .code-editor textarea:focus{outline:1px solid #525252}.concept-container .example-container .code-section .syntax-errors{padding:1rem;background-color:#1e1f1c;border-top:1px solid #3c3d37}.concept-container .example-container .code-section .syntax-errors .error{display:flex;align-items:center;gap:.5rem;color:#f44336;font-size:.9rem;margin-bottom:.5rem}.concept-container .example-container .code-section .syntax-errors .error:last-child{margin-bottom:0}.concept-container .example-container .output-section{border:1px solid #e0e0e0;border-radius:4px;display:flex;flex-direction:column}.concept-container .example-container .output-section .output-header{display:flex;justify-content:space-between;align-items:center;padding:.5rem 1rem;border-bottom:1px solid #e0e0e0}.concept-container .example-container .output-section .output-header h3{margin:0;color:#333}.concept-container .example-container .output-section .console-output{flex:1;min-height:300px;padding:1rem;background-color:#2d2d2d;color:#f8f8f2;font-family:Fira Code,monospace;font-size:.9rem;overflow-y:auto}.concept-container .example-container .output-section .console-output .log-entry{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.5rem;padding:.25rem;border-radius:4px}.concept-container .example-container .output-section .console-output .log-entry.log{color:#f8f8f2}.concept-container .example-container .output-section .console-output .log-entry.info{color:#66d9ef}.concept-container .example-container .output-section .console-output .log-entry.warn{color:#e6db74;background-color:#e6db741a}.concept-container .example-container .output-section .console-output .log-entry.error{color:#f44336;background-color:#f443361a}.concept-container .example-container .output-section .console-output .log-entry mat-icon{font-size:1.2rem;width:1.2rem;height:1.2rem}.concept-container .example-container .output-section .console-output .log-entry pre{margin:0;white-space:pre-wrap;word-break:break-word;flex:1}.concept-container .quiz-card{margin-bottom:1rem}.concept-container .quiz-card .options{display:flex;flex-direction:column;gap:.5rem;margin-top:1rem}.concept-container .quiz-card .answer-feedback{margin-top:1rem;padding:1rem;border-radius:4px}.concept-container .quiz-card .answer-feedback .correct{color:#4caf50;font-weight:700}.concept-container .quiz-card .answer-feedback .incorrect{color:#f44336;font-weight:700}.concept-container .quiz-card .answer-feedback .explanation{margin-top:.5rem;color:#666}.concept-container .quiz-header{text-align:center;margin-bottom:2rem}.concept-container .quiz-header h3{color:#333;margin-bottom:.5rem}.concept-container .quiz-header p{font-size:1.2rem;color:#666;margin-bottom:1rem}.concept-container .quiz-actions{display:flex;justify-content:center;margin-top:2rem}.concept-container mat-chip.beginner{background-color:#4caf50;color:#fff}.concept-container mat-chip.intermediate{background-color:#ff9800;color:#fff}.concept-container mat-chip.advanced{background-color:#f44336;color:#fff}
`],encapsulation:2})};var ct=[{path:"",component:E},{path:"concept/:conceptId",component:O}],X=class a{static \u0275fac=function(e){return new(e||a)};static \u0275mod=$({type:a});static \u0275inj=Y({imports:[U.forChild(ct),U]})},Je=class a{static \u0275fac=function(e){return new(e||a)};static \u0275mod=$({type:a});static \u0275inj=Y({imports:[X,E,O]})};export{Je as JavascriptModule,X as JavascriptRoutingModule};
