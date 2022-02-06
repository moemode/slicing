J$.iids = {"9":[5,9,5,10],"17":[5,9,5,10],"25":[5,5,5,11],"33":[6,9,6,10],"41":[6,9,6,10],"49":[6,5,6,11],"57":[7,9,7,10],"65":[7,9,7,10],"73":[7,5,7,11],"81":[8,12,8,13],"89":[8,12,8,13],"97":[8,5,8,14],"105":[1,1,9,2],"113":[1,1,9,2],"121":[1,1,9,2],"129":[1,1,9,2],"137":[1,1,9,2],"145":[11,1,11,8],"153":[11,1,11,10],"161":[11,1,11,11],"169":[1,1,11,11],"177":[1,1,9,2],"185":[1,1,11,11],"193":[1,1,9,2],"201":[1,1,9,2],"209":[1,1,11,11],"217":[1,1,11,11],"nBranches":0,"originalCodeFileName":"/home/v/coding/slicing/testcases/pm2/preproc_e1_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/pm2/preproc_e1_in_jalangi_.js","code":"function sliceMe() {\n    var x;\n    var y;\n    var z;\n    x = 1;\n    y = x;\n    z = y;\n    return z;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(169, '/home/v/coding/slicing/testcases/pm2/preproc_e1_in_jalangi_.js', '/home/v/coding/slicing/testcases/pm2/preproc_e1_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(105, arguments.callee, this, arguments);
                            arguments = J$.N(113, 'arguments', arguments, 4);
                            J$.N(121, 'x', x, 0);
                            J$.N(129, 'y', y, 0);
                            J$.N(137, 'z', z, 0);
                            var x;
                            var y;
                            var z;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(49, y = J$.W(41, 'y', J$.R(33, 'x', x, 0), y, 0));
                            J$.X1(73, z = J$.W(65, 'z', J$.R(57, 'y', y, 0), z, 0));
                            return J$.X1(97, J$.Rt(89, J$.R(81, 'z', z, 0)));
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
            sliceMe = J$.N(185, 'sliceMe', J$.T(177, sliceMe, 12, false, 105), 0);
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
