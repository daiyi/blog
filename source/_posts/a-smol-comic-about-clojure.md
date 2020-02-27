---
title: a smol comic about clojure
categories: comics
tags:
  - clojure
summary: "I drew clojure as a mushroom, multiple times!"
hideSummary: true
image: clj_symbiot.jpg
location: Berlin
date: 2017-07-18 23:20:55
---

![](clj_0.jpg)
![](clj_1.jpg)
![](clj_2.jpg)
![](clj_3.jpg)

<br><br>

I made this cute comic because I've been writing a lot of clojure(/script) and people have been asking me about it so I've been introducing it a lot, and also holy crap a friend gifted me a graphics tablet over the weekend and I am finally reunited with digital art aaah :D :D :D

For those following along at home on shitty internet connections or screen readers or are struggling to parse my funky handwriting, I've transcribed the comic below!

## introducing clojure! (and clojurescript)

([clojure](https://en.wikipedia.org/wiki/Clojure) says ♥, and clojurescript says ♥_BANG\_ because alas, it has gone through the transpiler).

### clojure is a dialect of lisp.

```clojure
{ :name                "lisp"
  :birth               1958
  :age                 59
  :typing              [:strong :dynamic]
  :favourite-ice-cream "vanilla"}
```

Cool thing I learned: [lisp](https://en.wikipedia.org/wiki/Lisp) was the first (non-assembly) [self-hosted](https://en.wikipedia.org/wiki/Self-hosting) language (it compiled itself!!)

```clojure
{ :name                "clojure"
  :birth               2007
  :age                 10
  :typing              [:strong :dynamic]
  :favourite-ice-cream "raspberry cheesecake"}
```

(here I drew a lisp family tree, except the tree is an octopus)

### clojure is a hosted language.

This means it is a [symbiote](https://en.wikipedia.org/wiki/Commensalism) living on the [JVM](https://en.wikipedia.org/wiki/Java_virtual_machine) (Java Virtual Machine). Clojure can talk to its host with [interop](http://www.braveclojure.com/java/). That means it can use its host's libraries :D

(here I drew clojure as a mushroom, also a symbiote, whispering sweet interops into the ear of the JVM).

Clojure can target many things! We call it [clojurescript](https://clojurescript.org) when it targets javascript. That means we can write clojure programs that work in the browser :D

(here I drew clojurescript also as a mushroom, lookin pretty chill on its host, javascript, console.log-ing, as one does.)

(I can't believe I just spent my evening drawing clojure as various mushrooms...)

### choosing a text editor to use with clojure seems to be something people think deeply about.

Lots of people like [emacs](https://www.gnu.org/software/emacs).

I use [Atom](https://atom.io).

As long as you've got something automatically minding your parens (e.g. [parinfer](https://shaunlebron.github.io/parinfer) or paredit) it's probably fine. (here I drew a thumbs up, except the thumb is a face, and the face is saying "nice.")

(extra note: if you decide to use emacs, don't try to configure it from scratch like I did the first three times I tried to use emacs. go borrow [someone else](https://github.com/jackrusher/dotemacs)'s configuration!)

### why would anyone use clojure??

- JVM
  - lots of mature libraries from java
  - JVM abstracts away hardware & OS
- concurrency
  - clojure was designed for concurrency!
- lisp
  - lisps are fun to write :D
  - functional programming is an interesting way to think
  - everything is data in clojure, which is a pattern really suited for some tasks
  - macros are powerful and fun!
- community ♥
  - people are super friendly
  - you can directly talk with a lot of library maintainers and helpful folks in #clojurians slack channel
  - cozy local communities, such as in Berlin (:
  - ClojureBridge!!

### what are the problems?

- it takes a while for your brain to adjust if you are coming from some languages.
- the toolset and build process was a lot to take in at once (I'm still learning it...)
- it'll probably be a while before you're comfortable enough to harness the full power of the language.
- it's really hard to make fan art because there are no animals or puns ):

It's okay! Just go have fun!

Also I'm super excited because Euroclojure is this week and it's in Berlin! aaahh see you there?? (if you manage to find me and give me paper I'll draw you hosting clojure as a mushroom, because I haven't drawn enough mushrooms this week).
