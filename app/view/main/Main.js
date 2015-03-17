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
        tbar: [{
            text: 'Select: Dx or Lab',
            handler: function() {
                var panel = Ext.getCmp('Ajax'),
                    payload = Ext.create('cardioCatalogQT.store.Payload');
                if (panel){ // destroy element if it exists
                    panel.setHtml('');
                }

                Ext.widget('form', {
                    xtype: 'multi-selector',
                    width: 300,
                    height: 400,
                    requires: [
                        'Ext.view.MultiSelector'
                    ],
                    renderTo: Ext.getBody(),
                    padding: -5,
                    items: [{
                        anchor: '50%',
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

                                var submitted = Ext.getCmp('diagnosis'),
                                    dx = [];
                                console.log(submitted)

                                Ext.Array.each(submitted.store.data.items, function (item) {
                                    dx.push(item.data.string_value);

                                    console.log(item)
                                    // write selected to store
                                    // TODO: ensure record does not already exist
                                    payload.add({
                                        key: item.data.string_value,
                                        comparator: 'eq',
                                        value: 'dx_code'
                                    })
                                    payload.sync();
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

                        id: 'diagnosis',
                        name:'diagnosis',
                        fieldName: 'string_value',

                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No Dx selected'
                        },
                        // TODO: fix ability to remove selected items when box is unchecked
                        search: {
                            field: 'string_value',
                            store: 'Diagnoses',

                            search: function (text) {
                                var me = this,
                                    filter = me.searchFilter,
                                    filters = me.getSearchStore().getFilters();

                                if (text) {
                                    filters.beginUpdate();

                                    if (filter) {
                                        filter.setValue(text);
                                    } else {
                                        me.searchFilter = filter = new Ext.util.Filter({
                                            id: 'search',
                                            property: me.field,
                                            value: text,

                                            // only change from http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/source/MultiSelectorSearch.html#Ext-view-MultiSelectorSearch-method-search
                                            anyMatch: true
                                        });
                                    }

                                    filters.add(filter);

                                    filters.endUpdate();
                                } else if (filter) {
                                    filters.remove(filter);
                                }
                            }
                        }
                    },{
                        anchor: '50%',
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

                                var submitted = Ext.getCmp('lab');

                                var lx = [];
                                Ext.Array.each(submitted.store.data.items, function (item) {
                                    lx.push(item.data.string_value);
                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following labTests will be sent to the server:  <br />' + lx);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(lx);
                                }
                            }
                        }],
                        xtype: 'multiselector',
                        title: 'Selected Lab',

                        id: 'lab',
                        name:'lab',
                        fieldName: 'string_value',

                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No Lab selected'
                        },
                        // TODO: fix ability to remove selected items when box is unchecked
                        search: {
                            field: 'string_value',
                            store: 'LabTests',

                            search: function (text) {
                                var me = this,
                                    filter = me.searchFilter,
                                    filters = me.getSearchStore().getFilters();

                                if (text) {
                                    filters.beginUpdate();

                                    if (filter) {
                                        filter.setValue(text);
                                    } else {
                                        me.searchFilter = filter = new Ext.util.Filter({
                                            id: 'search',
                                            property: me.field,
                                            value: text,

                                            // only change from http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/source/MultiSelectorSearch.html#Ext-view-MultiSelectorSearch-method-search
                                            anyMatch: true
                                        });
                                    }

                                    filters.add(filter);

                                    filters.endUpdate();
                                } else if (filter) {
                                    filters.remove(filter);
                                }
                            }
                        }
                    }]
                }).center();
            }},{
            text: 'Vitals Test',
            handler: function() {
                var panel = Ext.getCmp('Ajax'),
                    payload = Ext.create('cardioCatalogQT.store.Payload');;


                if (panel){ // destroy element if it exists
                    panel.setHtml('');
                }

                Ext.widget('form', {
                    xtype: 'form-fieldtypes',
                    width: 400,
                    bodyPadding: 10,
                    layout: 'form',

                    renderTo: Ext.getBody(),
                    items: [{
                        bbar: [{
                            xtype: 'button',
                            itemId: 'button',
                            html: 'Toolbar here',

                            text: 'Submit request to API',

                            // get submitted array
                            handler: function(btn) {
                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('In submitted values handler: ');
                                }

                                var submitted = btn.up('form');

                                //var submitted = form.findField('vitalComparator').getSubmitValue();

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('show object');
                                    console.log(submitted.items)
                                }


                                //values = submitted.getValues();

                                var vx = [];
                                Ext.Array.each(submitted.items.items[0],function (item) {
                                    vx.push(item.items.items.lastValue)

                                    payload.add({
                                        key: 'vitals' ,
                                        comparator: item.items.items[1].lastValue,
                                        value: item.items.items[0].lastValue,
                                    })
                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following labTests will be sent to the server:  <br />' + vx);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(vx);
                                }

                                payload.sync();
                            }
                        }],

                        id: 'vitals',
                        name:'vitals',

                        items: [{
                            xtype: 'textfield',
                            name: 'vitalValue',
                            fieldLabel: 'Value',
                            value: 'Vital value'
                        },
                        {
                            xtype: 'combo',
                            name: 'vitalComparator',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'vitalComparator',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name : '=', value: 'eq'},
                                    {name : '<', value: 'gt'},
                                    {name : '>', value: 'lt'}
                                ]
                            }
                        }]
                    }]
                }).center();
            }},{
            text: 'SubmitQuery',
            handler: function() {

                var test;

                test = Ext.getCmp('diagnosis');
                if (test){  // destroy element if it exists
                    test.destroy();
                }
                test = Ext.getCmp('vitals');
                if (test){  // destroy element if it exists
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

                url += payload; // append payload to URL

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

