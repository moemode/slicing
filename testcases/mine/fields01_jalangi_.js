J$.iids = {"9":[2,22,2,28],"17":[2,13,2,29],"25":[2,13,2,29],"33":[2,13,2,29],"41":[3,5,3,6],"49":[3,14,3,20],"57":[3,5,3,20],"65":[3,5,3,21],"73":[4,12,4,13],"81":[4,12,4,18],"89":[4,12,4,18],"97":[4,5,4,19],"105":[1,1,5,2],"113":[1,1,5,2],"121":[1,1,5,2],"129":[7,1,7,8],"137":[7,1,7,10],"145":[7,1,7,11],"153":[1,1,7,11],"161":[1,1,5,2],"169":[1,1,7,11],"177":[1,1,5,2],"185":[1,1,5,2],"193":[1,1,7,11],"201":[1,1,7,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/slicer/testcases/mine/fields01.js","instrumentedCodeFileName":"/home/v/slicing/slicer/testcases/mine/fields01_jalangi_.js","code":"function sliceMe() {\n    var p = {\"name\": \"Mack\"};\n    p.name = \"King\";\n    return p.name;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(153, '/home/v/slicing/slicer/testcases/mine/fields01_jalangi_.js', '/home/v/slicing/slicer/testcases/mine/fields01.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(105, arguments.callee, this, arguments);
                            arguments = J$.N(113, 'arguments', arguments, 4);
                            J$.N(121, 'p', p, 0);
                            var p = J$.X1(33, J$.W(25, 'p', J$.T(17, {
                                "name": J$.T(9, "Mack", 21, false)
                            }, 11, false), p, 1));
                            J$.X1(65, J$.P(57, J$.R(41, 'p', p, 0), 'name', J$.T(49, "King", 21, false), 0));
                            return J$.X1(97, J$.Rt(89, J$.G(81, J$.R(73, 'p', p, 0), 'name', 0)));
                        } catch (J$e) {
                            J$.Ex(177, J$e);
                        } finally {
                            if (J$.Fr(185))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(169, 'sliceMe', J$.T(161, sliceMe, 12, false, 105), 0);
            J$.X1(145, J$.F(137, J$.R(129, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(193, J$e);
        } finally {
            if (J$.Sr(201)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
