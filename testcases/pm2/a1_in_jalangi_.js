J$.iids = {"9":[5,9,5,10],"10":[7,9,7,14],"17":[5,9,5,10],"25":[5,5,5,11],"33":[6,9,6,10],"41":[6,9,6,10],"49":[6,5,6,11],"57":[7,9,7,10],"65":[7,13,7,14],"73":[7,9,7,14],"81":[7,5,7,15],"89":[8,12,8,13],"97":[8,12,8,13],"105":[8,5,8,14],"113":[1,1,9,2],"121":[1,1,9,2],"129":[1,1,9,2],"137":[1,1,9,2],"145":[1,1,9,2],"153":[11,1,11,8],"161":[11,1,11,10],"169":[11,1,11,11],"177":[1,1,11,11],"185":[1,1,9,2],"193":[1,1,11,11],"201":[1,1,9,2],"209":[1,1,9,2],"217":[1,1,11,11],"225":[1,1,11,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/pm2/a1_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/pm2/a1_in_jalangi_.js","code":"function sliceMe() {\n    var x;\n    var y;\n    var z;\n    x = 1;\n    y = 2;\n    z = y + y;\n    return z;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(177, '/home/v/slicing/testcases/pm2/a1_in_jalangi_.js', '/home/v/slicing/testcases/pm2/a1_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(113, arguments.callee, this, arguments);
                            arguments = J$.N(121, 'arguments', arguments, 4);
                            J$.N(129, 'x', x, 0);
                            J$.N(137, 'y', y, 0);
                            J$.N(145, 'z', z, 0);
                            var x;
                            var y;
                            var z;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(49, y = J$.W(41, 'y', J$.T(33, 2, 22, false), y, 0));
                            J$.X1(81, z = J$.W(73, 'z', J$.B(10, '+', J$.R(57, 'y', y, 0), J$.R(65, 'y', y, 0), 0), z, 0));
                            return J$.X1(105, J$.Rt(97, J$.R(89, 'z', z, 0)));
                        } catch (J$e) {
                            J$.Ex(201, J$e);
                        } finally {
                            if (J$.Fr(209))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(193, 'sliceMe', J$.T(185, sliceMe, 12, false, 113), 0);
            J$.X1(169, J$.F(161, J$.R(153, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(217, J$e);
        } finally {
            if (J$.Sr(225)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
