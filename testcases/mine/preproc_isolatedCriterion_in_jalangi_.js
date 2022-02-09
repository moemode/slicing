J$.iids = {"9":[2,13,2,15],"17":[2,13,2,15],"25":[2,13,2,15],"33":[3,5,3,6],"41":[3,7,3,10],"49":[3,14,3,15],"57":[3,5,3,15],"65":[3,5,3,16],"73":[4,5,4,12],"81":[4,5,4,12],"89":[1,1,5,2],"97":[1,1,5,2],"105":[1,1,5,2],"113":[7,1,7,8],"121":[7,1,7,10],"129":[7,1,7,11],"137":[1,1,7,11],"145":[1,1,5,2],"153":[1,1,7,11],"161":[1,1,5,2],"169":[1,1,5,2],"177":[1,1,7,11],"185":[1,1,7,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_isolatedCriterion_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_isolatedCriterion_in_jalangi_.js","code":"function sliceMe() {\n    var o = {};\n    o[\"t\"] = 2;\n    return;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(137, '/home/v/slicing/testcases/mine/preproc_isolatedCriterion_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_isolatedCriterion_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(89, arguments.callee, this, arguments);
                            arguments = J$.N(97, 'arguments', arguments, 4);
                            J$.N(105, 'o', o, 0);
                            var o = J$.X1(25, J$.W(17, 'o', J$.T(9, {}, 11, false), o, 1));
                            J$.X1(65, J$.P(57, J$.R(33, 'o', o, 0), J$.T(41, "t", 21, false), J$.T(49, 2, 22, false), 2));
                            return J$.X1(81, J$.Rt(73, undefined));
                        } catch (J$e) {
                            J$.Ex(161, J$e);
                        } finally {
                            if (J$.Fr(169))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(153, 'sliceMe', J$.T(145, sliceMe, 12, false, 89), 0);
            J$.X1(129, J$.F(121, J$.R(113, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(177, J$e);
        } finally {
            if (J$.Sr(185)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
