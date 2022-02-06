J$.iids = {"9":[2,21,2,39],"17":[2,13,2,40],"25":[2,13,2,40],"33":[2,13,2,40],"41":[3,13,3,21],"49":[3,13,3,21],"57":[3,13,3,21],"65":[4,13,4,15],"73":[4,13,4,15],"81":[4,13,4,15],"89":[5,9,5,10],"97":[5,9,5,10],"105":[5,5,5,11],"113":[6,5,6,6],"121":[6,18,6,19],"129":[6,5,6,19],"137":[6,5,6,20],"145":[7,13,7,14],"153":[7,13,7,21],"161":[7,13,7,21],"169":[7,13,7,21],"177":[8,12,8,13],"185":[8,12,8,22],"193":[8,12,8,22],"201":[8,5,8,23],"209":[1,1,9,2],"217":[1,1,9,2],"225":[1,1,9,2],"233":[1,1,9,2],"241":[1,1,9,2],"249":[1,1,9,2],"257":[11,1,11,8],"265":[11,1,11,10],"273":[11,1,11,11],"281":[1,1,12,1],"289":[1,1,9,2],"297":[1,1,12,1],"305":[1,1,9,2],"313":[1,1,9,2],"321":[1,1,12,1],"329":[1,1,12,1],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_e2_mod_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_e2_mod_in_jalangi_.js","code":"function sliceMe() {\n    var a = {course:'Program Analysis'};\n    var b = 'Winter';\n    var c = {};\n    c = a;\n    c.semester = b;\n    var d = c.course;\n    return a.semester;\n}\n\nsliceMe();\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(281, '/home/v/coding/slicing/testcases/mine/preproc_e2_mod_in_jalangi_.js', '/home/v/coding/slicing/testcases/mine/preproc_e2_mod_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(209, arguments.callee, this, arguments);
                            arguments = J$.N(217, 'arguments', arguments, 4);
                            J$.N(225, 'a', a, 0);
                            J$.N(233, 'b', b, 0);
                            J$.N(241, 'c', c, 0);
                            J$.N(249, 'd', d, 0);
                            var a = J$.X1(33, J$.W(25, 'a', J$.T(17, {
                                course: J$.T(9, 'Program Analysis', 21, false)
                            }, 11, false), a, 1));
                            var b = J$.X1(57, J$.W(49, 'b', J$.T(41, 'Winter', 21, false), b, 1));
                            var c = J$.X1(81, J$.W(73, 'c', J$.T(65, {}, 11, false), c, 1));
                            J$.X1(105, c = J$.W(97, 'c', J$.R(89, 'a', a, 0), c, 0));
                            J$.X1(137, J$.P(129, J$.R(113, 'c', c, 0), 'semester', J$.R(121, 'b', b, 0), 0));
                            var d = J$.X1(169, J$.W(161, 'd', J$.G(153, J$.R(145, 'c', c, 0), 'course', 0), d, 1));
                            return J$.X1(201, J$.Rt(193, J$.G(185, J$.R(177, 'a', a, 0), 'semester', 0)));
                        } catch (J$e) {
                            J$.Ex(305, J$e);
                        } finally {
                            if (J$.Fr(313))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(297, 'sliceMe', J$.T(289, sliceMe, 12, false, 209), 0);
            J$.X1(273, J$.F(265, J$.R(257, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(321, J$e);
        } finally {
            if (J$.Sr(329)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
