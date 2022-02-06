J$.iids = {"9":[2,13,2,31],"17":[2,13,2,31],"25":[2,13,2,31],"33":[3,13,3,21],"41":[3,13,3,21],"49":[3,13,3,21],"57":[4,22,4,23],"65":[4,35,4,36],"73":[4,13,4,37],"81":[4,13,4,37],"89":[4,13,4,37],"97":[5,13,5,14],"105":[5,13,5,21],"113":[5,13,5,21],"121":[5,13,5,21],"129":[6,12,6,13],"137":[6,12,6,13],"145":[6,5,6,14],"153":[1,1,7,2],"161":[1,1,7,2],"169":[1,1,7,2],"177":[1,1,7,2],"185":[1,1,7,2],"193":[1,1,7,2],"201":[9,1,9,8],"209":[9,1,9,10],"217":[9,1,9,11],"225":[1,1,9,11],"233":[1,1,7,2],"241":[1,1,9,11],"249":[1,1,7,2],"257":[1,1,7,2],"265":[1,1,9,11],"273":[1,1,9,11],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/testcases/milestone2/preproc_a7_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/milestone2/preproc_a7_in_jalangi_.js","code":"function sliceMe() {\n    var a = 'Program Analysis';\n    var b = 'Winter';\n    var c = {course: a, semester: b};\n    var d = c.course;\n    return d;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(225, '/home/v/coding/slicing/testcases/milestone2/preproc_a7_in_jalangi_.js', '/home/v/coding/slicing/testcases/milestone2/preproc_a7_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(153, arguments.callee, this, arguments);
                            arguments = J$.N(161, 'arguments', arguments, 4);
                            J$.N(169, 'a', a, 0);
                            J$.N(177, 'b', b, 0);
                            J$.N(185, 'c', c, 0);
                            J$.N(193, 'd', d, 0);
                            var a = J$.X1(25, J$.W(17, 'a', J$.T(9, 'Program Analysis', 21, false), a, 1));
                            var b = J$.X1(49, J$.W(41, 'b', J$.T(33, 'Winter', 21, false), b, 1));
                            var c = J$.X1(89, J$.W(81, 'c', J$.T(73, {
                                course: J$.R(57, 'a', a, 0),
                                semester: J$.R(65, 'b', b, 0)
                            }, 11, false), c, 1));
                            var d = J$.X1(121, J$.W(113, 'd', J$.G(105, J$.R(97, 'c', c, 0), 'course', 0), d, 1));
                            return J$.X1(145, J$.Rt(137, J$.R(129, 'd', d, 0)));
                        } catch (J$e) {
                            J$.Ex(249, J$e);
                        } finally {
                            if (J$.Fr(257))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(241, 'sliceMe', J$.T(233, sliceMe, 12, false, 153), 0);
            J$.X1(217, J$.F(209, J$.R(201, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(265, J$e);
        } finally {
            if (J$.Sr(273)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
