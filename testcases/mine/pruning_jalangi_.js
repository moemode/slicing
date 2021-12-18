J$.iids = {"9":[2,13,2,15],"17":[2,13,2,15],"25":[2,13,2,15],"33":[3,13,3,14],"41":[3,13,3,14],"49":[3,13,3,14],"57":[4,12,4,13],"65":[4,12,4,13],"73":[4,5,4,14],"81":[1,1,5,2],"89":[1,1,5,2],"97":[1,1,5,2],"105":[1,1,5,2],"113":[7,1,7,8],"121":[7,1,7,10],"129":[7,1,7,11],"137":[1,1,7,11],"145":[1,1,5,2],"153":[1,1,7,11],"161":[1,1,5,2],"169":[1,1,5,2],"177":[1,1,7,11],"185":[1,1,7,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/pruning.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/pruning_jalangi_.js","code":"function sliceMe() {\n    var x = 10;\n    var y = 0;\n    return y;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(137, '/home/v/slicing/testcases/mine/pruning_jalangi_.js', '/home/v/slicing/testcases/mine/pruning.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(81, arguments.callee, this, arguments);
                            arguments = J$.N(89, 'arguments', arguments, 4);
                            J$.N(97, 'x', x, 0);
                            J$.N(105, 'y', y, 0);
                            var x = J$.X1(25, J$.W(17, 'x', J$.T(9, 10, 22, false), x, 1));
                            var y = J$.X1(49, J$.W(41, 'y', J$.T(33, 0, 22, false), y, 1));
                            return J$.X1(73, J$.Rt(65, J$.R(57, 'y', y, 0)));
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
            sliceMe = J$.N(153, 'sliceMe', J$.T(145, sliceMe, 12, false, 81), 0);
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
