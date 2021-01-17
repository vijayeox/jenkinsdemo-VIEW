CKEDITOR.dialog.add('abbrDialog', function (editor) {

    return {

        // Basic properties of the dialog window: title, minimum size.
        title: 'Tag Avatars',
        minWidth: 250,
        minHeight: 100,

        // Dialog window contents definition.
        contents: [{
                // Definition of the Basic Settings dialog tab (page).
                id: 'tab-basic',
                label: 'Avatars',

                // The tab contents.
                elements: [{
                        // Text input field for the abbreviation text.
                        type: 'text',
                        id: 'avatarid',
                        label: 'Type an avatar name to tag',
                        onFocus: function (api) {
                            dialog = this.getDialog();
                            window.idavatar = dialog.getContentElement('tab-basic', 'avatarid').getInputElement().$.id;
                            var assigned_config = {

                                source: baseurl + "employee/ajax/assignedtoselect/",
                                select: function (event, ui) {

                                    $('#' + idavatar).val(ui.item.value);
                                    $('#' + idavatar).val(ui.item.id);
                                    window.abbr1 = ui.item.id;

                                },

                                change: function (ev, ui) {
                                    if (!ui.item) {
                                        $('#' + idavatar).val("");

                                    }
                                }

                            };

                            $('#' + idavatar).autocomplete(assigned_config);

                        }


                    },


                ]
            }, {
                // Definition of the Basic Settings dialog tab (page).
                id: 'tab-advanced',
                label: 'Items/Modules',

                // The tab contents.
                elements: [{
                        // Text input field for the abbreviation text.
                        type: 'text',
                        id: 'instanceid',
                        label: 'Type an item to tag',
                        onFocus: function (api) {
                            dialog = this.getDialog();
                            window.idinstance = dialog.getContentElement('tab-advanced', 'instanceid').getInputElement().$.id;
                            var ac_config = {
                                source: baseurl + "employee/module/parentlist/",
                                select: function (event, ui) {
                                    $("#" + idinstance).val(ui.item.value);
                                    $("#" + idinstance).val(ui.item.id);
                                    window.instancedid = ui.item.id;
                                },
                                change: function (ev, ui) {
                                    if (!ui.item) {
                                        $("#" + idinstance).val("");

                                    }
                                }

                            };
                            $("#" + idinstance).autocomplete(ac_config);

                        }


                    }


                ]
            }, {
                // Definition of the Basic Settings dialog tab (page).
                id: 'tab-pod',
                label: 'Pods',

                // The tab contents.
                elements: [{
                        // Text input field for the abbreviation text.
                        type: 'text',
                        id: 'podid',
                        label: 'Enter the Name of the matrix',
                        onFocus: function (api) {
                            dialog = this.getDialog();
                            window.idpod = dialog.getContentElement('tab-pod', 'podid').getInputElement().$.id;
                            podpos = dialog.getContentElement('tab-pod', 'podposid').getInputElement().$.id;
                            $('#'+podpos).find('option').remove();
                            var pod_config = {
                                source: baseurl + "employee/module/matrixlist/",
                                select: function (event, ui) {
                                    $("#" + idpod).val(ui.item.value);
                                    $("#" + idpod).val(ui.item.id);
                                    window.podinstanceid = ui.item.id;
                                    window.matrixid = ui.item.name;
                                    window.menutype = ui.item.menutype;
                                    window.actiontype = ui.item.actiontype;
                                    window.client_id = ui.item.client;

                                },
                                change: function (ev, ui) {
                                    if (!ui.item) {
                                        $("#" + idpod).val("");
                                        
                                    }
                                    $.ajax({       // @BUG 56441
                                        url: baseurl + "employee/module/getmatrixposition",
                                        data: {id: podinstanceid},
                                        dataType: 'json',
                                        success: function(data) {
                                            $('#'+podpos).find('option').remove();

                                            for(var i=0; i<data.dropdown.length; i++){
                                                var value = data.dropdown[i].replace('container_','');
                                                value = value.replace(podinstanceid,'');
                                                value = value.replace('_',' ');
                                                value = value.replace('_',' ');
                                                value = value.replace('_','');
                                                $('#'+podpos).append(new Option(value,data.dropdown[i]));

                                                
                                            }
                                        }
                                    });
                                    
                                }

                            };
                            $("#" + idpod).autocomplete(pod_config);

                        }



                    }, {
                        type: 'select',
                        id: 'podposid',
                        label: 'Pod Position',
                        widths: [100, 200],
                        items: [],

                        onChange: function (api) {
                            // this = CKEDITOR.ui.dialog.select
                            window.client = this.getValue();


                        }
                    }

                ]
            }



        ],

        onOk: function () {
            var dialog = this;
            abbr = dialog.getValueOf('tab-basic', 'avatarid');
            pod = dialog.getValueOf('tab-pod', 'podid');
            window.idpod = dialog.getContentElement('tab-pod', 'podid').getInputElement().$.id;
            podpos = dialog.getContentElement('tab-pod', 'podposid').getInputElement().$.id;
            var position_valule = $('#'+podpos).val();
            if (pod) {
              
               var x = location.href;
               var checkfc = x.match('create');
               var profilecheck = x.match('avatar');
               var msgceck = x.match('compose');
               var admincheck = x.match('admin');
               var supadmcheck = x.match('superadmin');
               if ((profilecheck == 'avatar')||(msgceck == 'compose')||(admincheck == 'admin')||(supadmcheck == 'superadmin'))
               {
                   alert("You cannot add a pod here");
                   return false;
               }
               if (checkfc == 'create'){
                alert("Please save the form to add pods");
                    return false;
                } 
                // @BUG 56441
              if (matrixid == undefined) {
                    var podurltr = pod + '<div id="pod-inst' + podinstanceid + '" data-url="/commatrix/commonmatrix/index/moduleid/28/instanceformid/' + podinstanceid + '"></div>';

                } else {
                    if(matrixid == 0){ // @BUG 79447
                        var podurltr = pod + '<div id="pod-inst' + matrixid + '" data-url="/commatrix/'+ menutype +'/'+ actiontype +'/moduleid/28/instanceformid/' + podinstanceid + '/load/partial/podname/' + position_valule+'"></div>';
                    }else{
                        if(actiontype === "timesheet"){
                            var podurltr = pod + '<div id="pod-inst' + matrixid + '" data-url="/commatrix/commonmatrix/'+actiontype+'/client/'+client_id+'/matrix/' + matrixid + '/moduleid/28/instanceformid/' + podinstanceid + '/load/partial/podname/' + position_valule + '"></div>';
                        }else{
                            var podurltr = pod + '<div id="pod-inst' + matrixid + '" data-url="/commatrix/commonmatrix/index/matrix/' + matrixid + '/moduleid/28/instanceformid/' + podinstanceid + '/load/partial/podname/' + position_valule+ '"></div>';
                        }
                    }
                }
                editor.insertHtml(podurltr);
// @Bug 36809 Bug in x-ref
                var instanceformid = $("#instanceformid").val();
       $.ajax({
            type: 'POST',
            async: true,
            data : {'url':x},
            url: baseurl+'employee/module/checkfunction/instanceformid/'+instanceformid,
            success: function(){
            }
            });  

            }
            
            if (abbr) {
                var url = baseurl + '/employee/avatar/friendsprofilepopup/avatarid/' + abbr1;
                var htmlavatar = '<a id="xref_avatars" class="infopopup20" data-target="#friendspopup" data-toggle="modal" href= ' + url + ' >' + abbr + '</a>';
                editor.insertHtml(htmlavatar);
            } else {
                // var dialog = this;
                instance = dialog.getValueOf('tab-advanced', 'instanceid');
                if (instance) {

                    var inst = '\$\[' + instancedid + '\!\description]';
                    editor.insertHtml(inst);


                }
            }
        }



    };
});