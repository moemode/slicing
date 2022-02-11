J$.iids = {"9":[3,16,3,27],"17":[3,34,3,35],"25":[3,9,3,36],"33":[3,9,3,36],"41":[3,5,3,37],"49":[4,5,4,6],"57":[4,14,4,22],"65":[4,5,4,22],"73":[4,5,4,23],"81":[5,5,5,6],"89":[5,19,5,20],"97":[5,5,5,20],"105":[5,5,5,21],"113":[6,5,6,12],"121":[6,5,6,12],"129":[1,1,7,2],"137":[1,1,7,2],"145":[1,1,7,2],"153":[9,1,9,8],"161":[9,1,9,10],"169":[9,1,9,11],"177":[1,1,9,11],"185":[1,1,7,2],"193":[1,1,9,11],"201":[1,1,7,2],"209":[1,1,7,2],"217":[1,1,9,11],"225":[1,1,9,11],"nBranches":0,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_objectDoubleRead_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_objectDoubleRead_in_jalangi_.js","code":"function sliceMe() {\n    var o;\n    o = {name: \"King Kong\", age: 5};\n    o.food = \"banana\";\n    o.important = o; //sc\n    return;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(177, '/home/v/slicing/testcases/mine/preproc_objectDoubleRead_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_objectDoubleRead_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(129, arguments.callee, this, arguments);
                            arguments = J$.N(137, 'arguments', arguments, 4);
                            J$.N(145, 'o', o, 0);
                            var o;
                            J$.X1(41, o = J$.W(33, 'o', J$.T(25, {
                                name: J$.T(9, "King Kong", 21, false),
                                age: J$.T(17, 5, 22, false)
                            }, 11, false), o, 0));
                            J$.X1(73, J$.P(65, J$.R(49, 'o', o, 0), 'food', J$.T(57, "banana", 21, false), 0));
                            J$.X1(105, J$.P(97, J$.R(81, 'o', o, 0), 'important', J$.R(89, 'o', o, 0), 0));
                            return J$.X1(121, J$.Rt(113, undefined));
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
            sliceMe = J$.N(193, 'sliceMe', J$.T(185, sliceMe, 12, false, 129), 0);
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
