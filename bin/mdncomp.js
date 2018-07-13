#!/usr/bin/env node
//require("./../build/build.min.js")();

global.lf = "\r\n";
global.sepChar = "|";
global.options = require("./../src/init.options.js");

// Anything to do?
if (!global.options.args.length) {
  global.options.help();
  return
}
console.log("to be continued...", `
ooooooooo&&&&&&&&&&&&&&&&8888&&&&&&&&&ooooo&&&&&&&&&8&8&&m&&&8888888888888888888888&o*====o
oooooooooooooooooooo&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&8888#8&&&&&&&88888&&888888888888&o====oo
ooooooooooooooooooooo&&&&&&&&&&&&&&&&&&&&&&&o&oo8oo&8#m8&&&&&&&&&&&&&&&&&&&&&&&&&&&&o*==*o&
ooooooo***oo**oooooooo&&&&&&&&&&&8&&&&&o&&8&&&&&&mm8##8&&8&oo&&&&&&&&&&&&&&&&&&&&&&&8&&om8&
*oooooooooo********ooooo&&&&&&&&&&&&&&88&&o8m8&88mm#W#888m&8&&&&&&&&&&&&&&&&&&&&o&&m######8
oooooooooooooooooooo*oooooo&&&8&&&8&8&&8888&m#88m##W#m#8#88&&&&&&&&&&&&&&&&&&8mm#m#########
ooooooooooooooooooooooooooo8&888m8m888mmmmmm###8####m#W#m8#88&&&&&&&8888m##################
88&8&&&&&&&&&&ooooooo&&&&&&8mmmmmm###mmm##########W###WW##mm8m8m88&88m#mmmmmmmmmmmm########
88888mm8888888888&&&&&&&&&m8mmm###mm###mm####################W##mm##m888888888888mmm#######
o&&&&&&888m88888888888&8888mm########m######################W#####mmm88&88&88&&8&&8mmmmm###
oo&&&&&&&&&&888888888888m8mmmm######mm############################mmmm88&&8888&8&&888mmmmmm
oooo&&&&&&&&&&&8888888888m#mmmmm##m###mmm############################mmoom####m*,8&8mmmmmmm
oooooo&&&&&&&&&&88888888888mmmmmmmmmm##mm#m###m############################m&o***&:&88mmm#=
&&&888&&&&&&&8&&8888m8888mm#mmmmmmmmmmm#m###m############################o&o.   m&::888mmo 
88888888888mmm8mmmmmmmmmm#####mmmmmmm##################################moo:        ,&888m  
&&&&&&&888888888mmmmmmm#m##mmmmmmm88mmm################################m&o*        =oo&8&  
&&&&&8888888m8mm8mmmm####mmmmm8mm88mm8mmmm##############################m8oo*,..:*o=&&o&o*=
&&&&&&&8888mmmmmmmmm###mmmm8mm888&&88mmmm8m##############################mmm8o*oom#8&&&&&8o
&&&&&&&&&&&&88mmmm###mmmmm888mmmm######m8mmmm#######mmm##################mmmmmmmmm8**o&&&*8
888888888&&&8888mm##mmmm88*:=&mm###m8oom###8mm###m8mmm88##WWWWWWW#&&m#####mm8888&:o===**oo:
&&&&&&&&&&888&88m##mmm8::m######WWWWWWWWWom#mm##m8m&#WWWWWWWWWWWWWWWW8&###mm8&=*o***ooooooo
&&&&&&&&&&&&&&&8m#mm8&:#########WWWmo*==:*#o#m##8&##oo*====#WWWWWWWWWWW&#mmm8&o************
oooooooooooooo&8m#m8&=#mmm######m&&*=,..,,::,m#8&&oo=:.  ,,:==WWWWWWWWWW&mmm8&*===========*
oooooooooooooo&8mm8&=##mmmm####o&o:     .W#,,o#8o**,     *W8,::WWWWWWWWWW#mmm&*============
&&&ooooooooooo&8mm8&*mmmmmmm##m&o=         .,&##o*=          ,:oWWWWWWWWW#mmm8*===::======*
oooooooooooooo&mm8&&=mmmmmmmm#m&o=         ,8mm#8&*:        .::#WWWWWWWW&#mm88*:::::===:==o
ooooooooooo**o&mm88&o&888888mm#&oo*.     ,=mm&m##m&*=,    ,:==mWWWWWWWW8#mm88&o=::::::=::*o
ooooooo**===::&mm88&&o:888888mm##ooooo***8&ooom####m&&*****=mWWWWWWWW8m#mmm8&oo*=::::::::*&
oo***=:,,,..,=8mm88&&ooo==oo&88mmmm8&&mm88m8&*&mm####mmm8&8mmmmm888####mmmm8&o**===:::::*o&
*=,,.,.....,,ommm88888&ooooooo&&8888888mmmmm#mmmmmmm#####mmmmm#########mmmm8&oo*:::::::=o&o
,..........,=8mm8888mmmmmmm8888888m8888888mmm88888mmmmmm############m#mmmm88&oo**:,::::*oo&
...........:8mmmm88m888mmmmmmmm88888888888888&8888mmmmmmmmmmmm#####mmmmmmm88&oo***=:::=*oo&
,,,,.....,&mmmmm8888m88888mmmmm8888&88mm888888888mm8mmmmmmmmmmmmmmmmmmmmm88&&o**===:::=*ooo
,,:::::,,om&&8mm88888888888m88888&8&88888m8mmmm8mmmmmmmmmmmmmmmmmmmmmmmm888&o**==::,::=*ooo
:,::::==***&o&8888888888888888888888888mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm888&oo*=:,,,:::=*ooo
=:==:===***&*&8888&&8&&8888888888888m888mmmmmmmmmmmmmm##mmm##mmmmmmmmm88&&oo**=:,,,,,.:**oo
::========**oo&88&&&&8&&8&&&8888mm88mmm8mmmmmmmmmmmmmmm#mm#mm#mmmmmmmm88&oo*==::,.....,=**o
,,====:=:::=*oo&&o&&&&&&oo&&&8m88&888mmm8mmmmmmmmmmmmmmmmmm#m##mmmmmm8&&o**=:::,,......,=**
::=::=:====*==**=ooo**ooooo888&888&8&m88mmmmmmmmmmmmmmm#mm#m#mmmmm8m88&o*==,,::=,...,...,,,
:,=:::::=::=*o*****=====*==*o*oo&&&&&&88888m8mmmmmm#mmmmmmmmmmmmm88&&***=*==:====,:,.,::,::
,::,::,,*===o:=:*=:**oo==*======:o**oooo**oo&&&o8m88mm88888&8888&ooo*=:***:*:*:o:====.====:
,..::=:===:*====*=***=:*==::::::::o===**o*==****&o&&&&&&&&8&oooo&o===**======*=***oo*:=====
,.,,,,=:::*:=:=**=*=*=:,=::=,::=*====*:*:,=*==::==o===o*=o=*=o*::=**=::**==**:=****:=:=*===
.,,,,:,:==:=====,=o==::=,:=:,:=&:*==*=*==:==:::=*===:==*=*:*=*=*:=***=**=*=**==*o::*:=:=o:*
`);
