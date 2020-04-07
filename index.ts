export class Tester {
    constructor(){}

    test() {
        return "working"
    }
}

var tester = new Tester()
var title = <HTMLHeadingElement>document.querySelector("#title")
title.innerHTML = tester.test()