J$.iids = {"9":[2,13,2,31],"17":[2,13,2,31],"25":[2,13,2,31],"33":[3,13,3,21],"41":[3,13,3,21],"49":[3,13,3,21],"57":[4,13,4,15],"65":[4,13,4,15],"73":[4,13,4,15],"81":[5,5,5,6],"89":[5,16,5,17],"97":[5,5,5,17],"105":[5,5,5,18],"113":[6,5,6,6],"121":[6,18,6,19],"129":[6,5,6,19],"137":[6,5,6,20],"145":[7,13,7,14],"153":[7,13,7,21],"161":[7,13,7,21],"169":[7,13,7,21],"177":[8,12,8,13],"185":[8,12,8,13],"193":[8,5,8,14],"201":[1,1,9,2],"209":[1,1,9,2],"217":[1,1,9,2],"225":[1,1,9,2],"233":[1,1,9,2],"241":[1,1,9,2],"249":[11,1,11,8],"257":[11,1,11,10],"265":[11,1,11,11],"273":[1,1,11,11],"281":[1,1,9,2],"289":[1,1,11,11],"297":[1,1,9,2],"305":[1,1,9,2],"313":[1,1,11,11],"321":[1,1,11,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/milestone2/preproc_a8_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/milestone2/preproc_a8_in_jalangi_.js","code":"function sliceMe() {\n    var a = 'Program Analysis';\n    var b = 'Winter';\n    var c = {};\n    c.course = a;\n    c.semester = b;\n    var d = c.course;\n    return d;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(273, '/home/v/slicing/testcases/milestone2/preproc_a8_in_jalangi_.js', '/home/v/slicing/testcases/milestone2/preproc_a8_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(201, arguments.callee, this, arguments);
                            arguments = J$.N(209, 'arguments', arguments, 4);
                            J$.N(217, 'a', a, 0);
                            J$.N(225, 'b', b, 0);
                            J$.N(233, 'c', c, 0);
                            J$.N(241, 'd', d, 0);
                            var a = J$.X1(25, J$.W(17, 'a', J$.T(9, 'Program Analysis', 21, false), a, 1));
                            var b = J$.X1(49, J$.W(41, 'b', J$.T(33, 'Winter', 21, false), b, 1));
                            var c = J$.X1(73, J$.W(65, 'c', J$.T(57, {}, 11, false), c, 1));
                            J$.X1(105, J$.P(97, J$.R(81, 'c', c, 0), 'course', J$.R(89, 'a', a, 0), 0));
                            J$.X1(137, J$.P(129, J$.R(113, 'c', c, 0), 'semester', J$.R(121, 'b', b, 0), 0));
                            var d = J$.X1(169, J$.W(161, 'd', J$.G(153, J$.R(145, 'c', c, 0), 'course', 0), d, 1));
                            return J$.X1(193, J$.Rt(185, J$.R(177, 'd', d, 0)));
                        } catch (J$e) {
                            J$.Ex(297, J$e);
                        } finally {
                            if (J$.Fr(305))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(289, 'sliceMe', J$.T(281, sliceMe, 12, false, 201), 0);
            J$.X1(265, J$.F(257, J$.R(249, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(313, J$e);
        } finally {
            if (J$.Sr(321)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
