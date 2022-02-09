J$.iids = {"9":[2,22,2,28],"17":[2,13,2,29],"25":[2,13,2,29],"33":[2,13,2,29],"41":[3,12,3,13],"49":[3,12,3,18],"57":[3,12,3,18],"65":[3,5,3,19],"73":[1,1,4,2],"81":[1,1,4,2],"89":[1,1,4,2],"97":[6,1,6,8],"105":[6,1,6,10],"113":[6,1,6,11],"121":[1,1,6,11],"129":[1,1,4,2],"137":[1,1,6,11],"145":[1,1,4,2],"153":[1,1,4,2],"161":[1,1,6,11],"169":[1,1,6,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_fields0_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_fields0_in_jalangi_.js","code":"function sliceMe() {\n    var p = {\"name\": \"Mack\"};\n    return p.name; //sc\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(121, '/home/v/slicing/testcases/mine/preproc_fields0_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_fields0_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(73, arguments.callee, this, arguments);
                            arguments = J$.N(81, 'arguments', arguments, 4);
                            J$.N(89, 'p', p, 0);
                            var p = J$.X1(33, J$.W(25, 'p', J$.T(17, {
                                "name": J$.T(9, "Mack", 21, false)
                            }, 11, false), p, 1));
                            return J$.X1(65, J$.Rt(57, J$.G(49, J$.R(41, 'p', p, 0), 'name', 0)));
                        } catch (J$e) {
                            J$.Ex(145, J$e);
                        } finally {
                            if (J$.Fr(153))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(137, 'sliceMe', J$.T(129, sliceMe, 12, false, 73), 0);
            J$.X1(113, J$.F(105, J$.R(97, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(161, J$e);
        } finally {
            if (J$.Sr(169)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
