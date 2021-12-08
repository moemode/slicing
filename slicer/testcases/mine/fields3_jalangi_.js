J$.iids = {"9":[2,25,2,27],"17":[2,13,2,29],"25":[2,13,2,29],"33":[2,13,2,29],"41":[3,23,3,29],"49":[3,13,3,31],"57":[3,13,3,31],"65":[3,13,3,31],"73":[4,5,4,6],"81":[4,16,4,17],"89":[4,5,4,17],"97":[4,5,4,18],"105":[5,5,5,6],"113":[5,14,5,22],"121":[5,5,5,22],"129":[5,5,5,22],"137":[6,5,6,6],"145":[6,14,6,22],"153":[6,5,6,22],"161":[6,5,6,22],"169":[7,12,7,13],"177":[7,12,7,20],"185":[7,12,7,25],"193":[7,12,7,25],"201":[7,5,7,26],"209":[1,1,8,2],"217":[1,1,8,2],"225":[1,1,8,2],"233":[1,1,8,2],"241":[9,1,9,8],"249":[9,1,9,10],"257":[9,1,9,11],"265":[1,1,9,11],"273":[1,1,8,2],"281":[1,1,9,11],"289":[1,1,8,2],"297":[1,1,8,2],"305":[1,1,9,11],"313":[1,1,9,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/slicer/testcases/mine/fields3.js","instrumentedCodeFileName":"/home/v/slicing/slicer/testcases/mine/fields3_jalangi_.js","code":"function sliceMe() {\n    var c = { \"course\": {} };\n    var p = { \"name\": \"Mack\" };\n    c.course = p;\n    p.name = \"Cheese\"\n    p.game = \"Soccer\"\n    return c.course.name;\n}\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(265, '/home/v/slicing/slicer/testcases/mine/fields3_jalangi_.js', '/home/v/slicing/slicer/testcases/mine/fields3.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(209, arguments.callee, this, arguments);
                            arguments = J$.N(217, 'arguments', arguments, 4);
                            J$.N(225, 'c', c, 0);
                            J$.N(233, 'p', p, 0);
                            var c = J$.X1(33, J$.W(25, 'c', J$.T(17, {
                                "course": J$.T(9, {}, 11, false)
                            }, 11, false), c, 1));
                            var p = J$.X1(65, J$.W(57, 'p', J$.T(49, {
                                "name": J$.T(41, "Mack", 21, false)
                            }, 11, false), p, 1));
                            J$.X1(97, J$.P(89, J$.R(73, 'c', c, 0), 'course', J$.R(81, 'p', p, 0), 0));
                            J$.X1(129, J$.P(121, J$.R(105, 'p', p, 0), 'name', J$.T(113, "Cheese", 21, false), 0));
                            J$.X1(161, J$.P(153, J$.R(137, 'p', p, 0), 'game', J$.T(145, "Soccer", 21, false), 0));
                            return J$.X1(201, J$.Rt(193, J$.G(185, J$.G(177, J$.R(169, 'c', c, 0), 'course', 0), 'name', 0)));
                        } catch (J$e) {
                            J$.Ex(289, J$e);
                        } finally {
                            if (J$.Fr(297))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(281, 'sliceMe', J$.T(273, sliceMe, 12, false, 209), 0);
            J$.X1(257, J$.F(249, J$.R(241, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(305, J$e);
        } finally {
            if (J$.Sr(313)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
