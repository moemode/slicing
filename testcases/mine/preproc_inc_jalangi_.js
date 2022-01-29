J$.iids = {"9":[2,13,2,14],"10":[3,18,3,21],"17":[2,13,2,14],"25":[2,13,2,14],"26":[3,18,3,21],"33":[3,13,3,14],"34":[3,13,3,22],"49":[3,18,3,19],"57":[3,18,3,21],"73":[3,13,3,22],"81":[3,13,3,22],"89":[4,12,4,13],"97":[4,12,4,13],"105":[4,5,4,14],"113":[1,1,5,2],"121":[1,1,5,2],"129":[1,1,5,2],"137":[1,1,5,2],"145":[7,1,7,8],"153":[7,1,7,10],"161":[7,1,7,11],"169":[1,1,7,11],"177":[1,1,5,2],"185":[1,1,7,11],"193":[1,1,5,2],"201":[1,1,5,2],"209":[1,1,7,11],"217":[1,1,7,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_inc.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_inc_jalangi_.js","code":"function sliceMe() {\n    var i = 1;\n    var d = 5 + (i++);\n    return i;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(169, '/home/v/slicing/testcases/mine/preproc_inc_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_inc.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(113, arguments.callee, this, arguments);
                            arguments = J$.N(121, 'arguments', arguments, 4);
                            J$.N(129, 'i', i, 0);
                            J$.N(137, 'd', d, 0);
                            var i = J$.X1(25, J$.W(17, 'i', J$.T(9, 1, 22, false), i, 1));
                            var d = J$.X1(81, J$.W(73, 'd', J$.B(34, '+', J$.T(33, 5, 22, false), J$.B(26, '-', i = J$.W(57, 'i', J$.B(18, '+', J$.U(10, '+', J$.R(49, 'i', i, 0)), J$.T(41, 1, 22, false), 0), i, 0), J$.T(65, 1, 22, false), 0), 0), d, 1));
                            return J$.X1(105, J$.Rt(97, J$.R(89, 'i', i, 0)));
                        } catch (J$e) {
                            J$.Ex(193, J$e);
                        } finally {
                            if (J$.Fr(201))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(185, 'sliceMe', J$.T(177, sliceMe, 12, false, 113), 0);
            J$.X1(161, J$.F(153, J$.R(145, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(209, J$e);
        } finally {
            if (J$.Sr(217)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
