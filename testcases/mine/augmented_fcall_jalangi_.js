J$.iids = {"9":[2,18,2,19],"17":[2,18,2,19],"25":[2,18,2,19],"33":[3,14,3,20],"41":[3,21,3,22],"49":[3,14,3,23],"57":[3,14,3,23],"65":[3,5,3,24],"73":[4,14,4,20],"81":[4,21,4,22],"89":[4,14,4,23],"97":[4,14,4,23],"105":[4,5,4,24],"113":[5,12,5,18],"121":[5,12,5,18],"129":[5,5,5,19],"137":[1,1,6,2],"145":[1,1,6,2],"153":[1,1,6,2],"161":[8,1,8,8],"169":[8,1,8,10],"177":[8,1,8,10],"185":[1,1,8,10],"193":[1,1,6,2],"201":[1,1,8,10],"209":[1,1,6,2],"217":[1,1,6,2],"225":[1,1,8,10],"233":[1,1,8,10],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/augmented_fcall.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/augmented_fcall_jalangi_.js","code":"function sliceMe() {\n    var status = 0;\n    status = Number(2);\n    status = Number(5);\n    return status;\n}\n\nsliceMe()"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(185, '/home/v/slicing/testcases/mine/augmented_fcall_jalangi_.js', '/home/v/slicing/testcases/mine/augmented_fcall.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(137, arguments.callee, this, arguments);
                            arguments = J$.N(145, 'arguments', arguments, 4);
                            J$.N(153, 'status', status, 0);
                            var status = J$.X1(25, J$.W(17, 'status', J$.T(9, 0, 22, false), status, 1));
                            J$.X1(65, status = J$.W(57, 'status', J$.F(49, J$.R(33, 'Number', Number, 2), 0)(J$.T(41, 2, 22, false)), status, 0));
                            J$.X1(105, status = J$.W(97, 'status', J$.F(89, J$.R(73, 'Number', Number, 2), 0)(J$.T(81, 5, 22, false)), status, 0));
                            return J$.X1(129, J$.Rt(121, J$.R(113, 'status', status, 0)));
                        } catch (J$e) {
                            J$.Ex(209, J$e);
                        } finally {
                            if (J$.Fr(217))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(201, 'sliceMe', J$.T(193, sliceMe, 12, false, 137), 0);
            J$.X1(177, J$.F(169, J$.R(161, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(225, J$e);
        } finally {
            if (J$.Sr(233)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
