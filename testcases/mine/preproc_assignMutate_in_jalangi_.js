J$.iids = {"9":[2,13,2,14],"10":[3,18,3,21],"17":[2,13,2,14],"25":[2,13,2,14],"26":[3,18,3,21],"33":[3,13,3,14],"34":[3,13,3,22],"42":[4,17,4,24],"49":[3,18,3,19],"57":[3,18,3,21],"73":[3,13,3,22],"81":[3,13,3,22],"89":[4,5,4,12],"97":[4,17,4,18],"105":[4,21,4,24],"113":[4,5,4,25],"115":[4,5,4,16],"121":[4,5,4,26],"129":[5,5,5,12],"137":[5,5,5,12],"145":[1,1,6,2],"153":[1,1,6,2],"161":[1,1,6,2],"169":[1,1,6,2],"177":[8,1,8,8],"185":[8,1,8,10],"193":[8,1,8,11],"201":[1,1,8,11],"209":[1,1,6,2],"217":[1,1,8,11],"225":[1,1,6,2],"233":[1,1,6,2],"241":[1,1,8,11],"249":[1,1,8,11],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_assignMutate_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_assignMutate_in_jalangi_.js","code":"function sliceMe() {\n    var a = 4;\n    var b = 3 + (a++);\n    console.log(a + \"z\"); // slicing criterion\n    return;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(201, '/home/v/coding/slicing/testcases/mine/preproc_assignMutate_in_jalangi_.js', '/home/v/coding/slicing/testcases/mine/preproc_assignMutate_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(145, arguments.callee, this, arguments);
                            arguments = J$.N(153, 'arguments', arguments, 4);
                            J$.N(161, 'a', a, 0);
                            J$.N(169, 'b', b, 0);
                            var a = J$.X1(25, J$.W(17, 'a', J$.T(9, 4, 22, false), a, 1));
                            var b = J$.X1(81, J$.W(73, 'b', J$.B(34, '+', J$.T(33, 3, 22, false), J$.B(26, '-', a = J$.W(57, 'a', J$.B(18, '+', J$.U(10, '+', J$.R(49, 'a', a, 0)), J$.T(41, 1, 22, false), 0), a, 0), J$.T(65, 1, 22, false), 0), 0), b, 1));
                            J$.X1(121, J$.M(113, J$.R(89, 'console', console, 2), 'log', 0)(J$.B(42, '+', J$.R(97, 'a', a, 0), J$.T(105, "z", 21, false), 0)));
                            return J$.X1(137, J$.Rt(129, undefined));
                        } catch (J$e) {
                            J$.Ex(225, J$e);
                        } finally {
                            if (J$.Fr(233))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(217, 'sliceMe', J$.T(209, sliceMe, 12, false, 145), 0);
            J$.X1(193, J$.F(185, J$.R(177, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(241, J$e);
        } finally {
            if (J$.Sr(249)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
