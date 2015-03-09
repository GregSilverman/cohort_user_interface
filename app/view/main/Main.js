/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('cardioCatalogQT.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'cardioCatalogQT.view.main.MainController',
        'cardioCatalogQT.view.main.MainModel',
        'Ext.ux.form.ItemSelector',
        'Ext.tip.QuickTipManager',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager'
    ],


    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'panel',
        id: 'Test',
        styleHtmlContent: true,

        bind: {
            title: '{name}'
        },
        region: 'west',
        html: '<ul><li>Add tree menu here.</li></ul>',
        width: 250,
        split: true,
        tbar: [
            {
            text: 'TestMS',
            handler: function() {
                var panel = Ext.getCmp('Ajax');
                if (panel){
                    panel.setHtml('');
                }

                var ms = Ext.widget('form', {
                    xtype: 'multi-selector',
                    width: 400,
                    height: 300,
                    requires: [
                        'Ext.view.MultiSelector'
                    ],
                    layout: 'fit',

                    renderTo: Ext.getBody(),
                    items: [{
                        bbar: [{
                            xtype: 'button',
                            itemId: 'button',
                            html: 'Toolbar here',

                            text: 'Submit request to API',

                            // get submitted array
                            handler: function() {
                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('In submitted values handler: ');
                                }

                                var submitted = Ext.getCmp('test');

                                var dx = [];
                                Ext.Array.each(submitted.store.data.items, function (item) {
                                    dx.push(item.data.string_value);
                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following diagnoses will be sent to the server:  <br />' + dx);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(dx);
                                }

                            }

                        }],
                        xtype: 'multiselector',
                        title: 'Selected Dx',

                        id: 'test',
                        name:'test',
                        fieldName: 'string_value',

                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No Dx selected'
                        },
                        // TODO: fix ability to remove selected items when box is unchecked
                        search: {
                            field: 'string_value',
                            store: 'Diagnoses'

                        }
                    }]
                }).center();
            }
            },
            {
            text: 'GetAjax',
            handler: function() {

                var test = Ext.getCmp('test');
                if (test){
                    test.destroy();
                }

                var panel = Ext.getCmp('Ajax'),
                    url = 'http://127.0.0.1:5000/api/getQ/',
                    payload = 'lab:TEST_CODE;eq;13457-7;lab:RESULT_VALUE_NUM;ge;160;',
                    json = [],
                    records = [],
                    store = Ext.create('Ext.data.Store',{
                        fields : [
                            'attribute',
                            'sid',
                            'value',
                            'N',
                            'source'
                        ],
                        data: records,
                        paging : false
                    });

                    payload  += 'vital:BLOOD_PRESSURE;eq;BLOOD_PRESSURE;vital:BLOOD_PRESSURE_SYSTOLIC;ge;160';

                panel.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading...'
                });

                url += payload;

                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        json = Ext.decode(response.responseText);
                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('json' + json);
                        }

                        if(json !== null &&  typeof (json) !==  'undefined'){

                            Ext.each(json, function(entry) {
                                Ext.each(json.items || [], function(tuple) {

                                    records.push({
                                        N: tuple[0].N,
                                        sid: tuple[0].sid,
                                        source: tuple[0].source
                                    });
                                    if (cardioCatalogQT.config.mode === 'test') {
                                        console.log(tuple[0].source
                                        + 'N ' + tuple[0].N
                                        + 'attribute ' + tuple[0].attribute
                                        + 'sid ' + tuple[0].sid
                                        + 'value ' + tuple[0].value);
                                    }
                                });
                            });
                            if (cardioCatalogQT.config.mode === 'test') {
                                console.log(records);
                            }

                            //update store with data
                            store.add(records);
                        }

                        var tpl;

                        // bind store to form panel
                        panel.setData(store);

                        // Get n: total number of rows returned

                        var n = store.getCount();
                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('n: ' + n);
                        }

                        // define template
                        tpl = new Ext.XTemplate(
                            '<tpl for=".">',
                                '<div class="clinical_phi" style="padding: 0 0 10px 20px;">',
                                    '<tpl if="data.lft == 1">',
                                        '<p>PATIENT: {data.sid}</p>',
                                        '<p>___________________</p>',
                                    '</tpl>',
                                    '<div class="data" style="padding: 0 0 10px 20px;">',
                                        '<tpl if="data.source == \'clinical\'">',
                                            '<li>{data.attribute.attribute_value} : {data.value} </li>',
                                        '</tpl>',
                                        '<tpl if="data.source == \'phi\'">',
                                        '   <li>{data.attribute_value} : {data.value} </li>',
                                        '</tpl>',
                                    '</div>',
                                '</div>',

                                '<div class="aggregate" style="padding: 0 0 10px 20px;">',
                                    '<tpl if="data.source == \'aggregate\'">',
                                        '<li> sid: {data.sid} </li>',
                                    '</tpl>',
                                '</div>',
                            '</tpl>'
                        );

                        // render template with store data to panel using HTML and remove mask from parent object
                        panel.setHtml('n: ' + n + ' '
                            + tpl.apply(store)); //TODO: add criteria on which query was executed
                        panel.unmask();

                    }
                });
            }

        }]
    },{
        region: 'center',
        xtype: 'panel',
        id: 'Ajax',
        styleHtmlContent: true,
        items:[{
            xtype: 'image',
            src: 'resources/images/cv.png',
            height: 80,
            width: 280
        },{
            title: 'UI Sandbox',
            html: '<h2>Ajax test.</h2>'
        }]
    }]
});

