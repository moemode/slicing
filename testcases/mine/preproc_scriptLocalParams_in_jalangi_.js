J$.iids = {"8":[4,9,4,26],"9":[2,18,2,21],"10":[4,13,4,21],"17":[2,18,2,28],"18":[4,9,4,26],"25":[2,18,2,28],"33":[2,18,2,28],"41":[3,18,3,27],"49":[3,18,3,27],"57":[3,18,3,27],"65":[4,9,4,12],"73":[4,13,4,19],"81":[4,20,4,21],"89":[4,9,4,22],"97":[4,25,4,26],"105":[5,18,5,25],"113":[5,18,5,25],"121":[5,9,5,26],"129":[7,5,7,12],"137":[7,17,7,23],"145":[7,5,7,24],"147":[7,5,7,16],"153":[7,5,7,25],"161":[8,5,8,11],"169":[8,5,8,12],"177":[1,1,9,2],"185":[1,1,9,2],"193":[1,1,9,2],"201":[1,1,9,2],"209":[1,1,9,2],"217":[11,10,11,11],"225":[11,13,11,14],"233":[11,16,11,17],"241":[11,19,11,20],"249":[11,22,11,23],"257":[11,25,11,26],"265":[11,28,11,29],"273":[11,31,11,32],"281":[11,34,11,35],"289":[11,37,11,39],"297":[11,9,11,40],"305":[11,9,11,40],"313":[11,9,11,40],"321":[12,1,12,8],"329":[12,9,12,10],"337":[12,1,12,11],"345":[12,1,12,12],"353":[1,1,12,12],"361":[1,1,9,2],"369":[1,1,12,12],"377":[1,1,12,12],"385":[4,5,6,6],"393":[1,1,9,2],"401":[1,1,9,2],"409":[1,1,12,12],"417":[1,1,12,12],"nBranches":2,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_scriptLocalParams_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_scriptLocalParams_in_jalangi_.js","code":"function sliceMe(arr) {    \n    var length = arr.length;\n    var status = \"invalid\";\n    if (arr[length-1] > 0){\n        status = \"valid\";//slicing criterion\n    }\n    console.log(status);\n    status; \n}\n\nvar a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nsliceMe(a);"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(353, '/home/v/slicing/testcases/mine/preproc_scriptLocalParams_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_scriptLocalParams_in.js');
            function sliceMe(arr) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(177, arguments.callee, this, arguments);
                            arguments = J$.N(185, 'arguments', arguments, 4);
                            arr = J$.N(193, 'arr', arr, 4);
                            J$.N(201, 'length', length, 0);
                            J$.N(209, 'status', status, 0);
                            var length = J$.X1(33, J$.W(25, 'length', J$.G(17, J$.R(9, 'arr', arr, 0), 'length', 0), length, 1));
                            var status = J$.X1(57, J$.W(49, 'status', J$.T(41, "invalid", 21, false), status, 1));
                            if (J$.X1(385, J$.C(8, J$.B(18, '>', J$.G(89, J$.R(65, 'arr', arr, 0), J$.B(10, '-', J$.R(73, 'length', length, 0), J$.T(81, 1, 22, false), 0), 4), J$.T(97, 0, 22, false), 0)))) {
                                J$.X1(121, status = J$.W(113, 'status', J$.T(105, "valid", 21, false), status, 0));
                            }
                            J$.X1(153, J$.M(145, J$.R(129, 'console', console, 2), 'log', 0)(J$.R(137, 'status', status, 0)));
                            J$.X1(169, J$.R(161, 'status', status, 0));
                        } catch (J$e) {
                            J$.Ex(393, J$e);
                        } finally {
                            if (J$.Fr(401))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(369, 'sliceMe', J$.T(361, sliceMe, 12, false, 177), 0);
            J$.N(377, 'a', a, 0);
            var a = J$.X1(313, J$.W(305, 'a', J$.T(297, [
                J$.T(217, 1, 22, false),
                J$.T(225, 2, 22, false),
                J$.T(233, 3, 22, false),
                J$.T(241, 4, 22, false),
                J$.T(249, 5, 22, false),
                J$.T(257, 6, 22, false),
                J$.T(265, 7, 22, false),
                J$.T(273, 8, 22, false),
                J$.T(281, 9, 22, false),
                J$.T(289, 10, 22, false)
            ], 10, false), a, 3));
            J$.X1(345, J$.F(337, J$.R(321, 'sliceMe', sliceMe, 1), 0)(J$.R(329, 'a', a, 1)));
        } catch (J$e) {
            J$.Ex(409, J$e);
        } finally {
            if (J$.Sr(417)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
