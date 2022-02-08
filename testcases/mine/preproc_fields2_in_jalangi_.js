J$.iids = {"9":[2,22,2,24],"17":[2,13,2,25],"25":[2,13,2,25],"33":[2,13,2,25],"41":[3,20,3,26],"49":[3,13,3,27],"57":[3,13,3,27],"65":[3,13,3,27],"73":[4,5,4,6],"81":[4,5,4,13],"89":[4,27,4,28],"97":[4,27,4,33],"105":[4,5,4,33],"113":[4,5,4,34],"121":[5,12,5,13],"129":[5,12,5,20],"137":[5,12,5,20],"145":[5,5,5,21],"153":[1,1,6,2],"161":[1,1,6,2],"169":[1,1,6,2],"177":[1,1,6,2],"185":[8,1,8,8],"193":[8,1,8,10],"201":[8,1,8,11],"209":[1,1,8,11],"217":[1,1,6,2],"225":[1,1,8,11],"233":[1,1,6,2],"241":[1,1,6,2],"249":[1,1,8,11],"257":[1,1,8,11],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_fields2_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_fields2_in_jalangi_.js","code":"function sliceMe() {\n    var c = {course: {}};\n    var p = {name: \"Mack\"}\n    c.course.instructor = p.name;\n    return c.course; //sc\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(209, '/home/v/coding/slicing/testcases/mine/preproc_fields2_in_jalangi_.js', '/home/v/coding/slicing/testcases/mine/preproc_fields2_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(153, arguments.callee, this, arguments);
                            arguments = J$.N(161, 'arguments', arguments, 4);
                            J$.N(169, 'c', c, 0);
                            J$.N(177, 'p', p, 0);
                            var c = J$.X1(33, J$.W(25, 'c', J$.T(17, {
                                course: J$.T(9, {}, 11, false)
                            }, 11, false), c, 1));
                            var p = J$.X1(65, J$.W(57, 'p', J$.T(49, {
                                name: J$.T(41, "Mack", 21, false)
                            }, 11, false), p, 1));
                            J$.X1(113, J$.P(105, J$.G(81, J$.R(73, 'c', c, 0), 'course', 0), 'instructor', J$.G(97, J$.R(89, 'p', p, 0), 'name', 0), 0));
                            return J$.X1(145, J$.Rt(137, J$.G(129, J$.R(121, 'c', c, 0), 'course', 0)));
                        } catch (J$e) {
                            J$.Ex(233, J$e);
                        } finally {
                            if (J$.Fr(241))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(225, 'sliceMe', J$.T(217, sliceMe, 12, false, 153), 0);
            J$.X1(201, J$.F(193, J$.R(185, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(249, J$e);
        } finally {
            if (J$.Sr(257)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
