/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */


// TODO:
// 1. Combine elements for between as part of payload store insert
// 2. Create URL
// 3. Ajax URL
// 4. Display results
// 5. Fix multi select resize


Ext.define('cardioCatalogQT.view.main.Main', {
    extend: 'Ext.tab.Panel',
    requires: [
        'cardioCatalogQT.view.main.MainController',
        'cardioCatalogQT.view.main.MainModel',
        'Ext.ux.form.ItemSelector',
        'Ext.tip.QuickTipManager',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager',
        'Ext.layout.container.Card',
        'Ext.layout.container.Card'
    ],

    xtype: 'layout-cardtabs',

    style: 'background-color:#dfe8f5;',
    width: '100%',
    height: 400,

    defaults: {
        bodyPadding: 5
    },

    items: [

        {
            title:'Main',
            region: 'center',
            xtype: 'form',
            id: 'Ajax',
            styleHtmlContent: true,
            items:[{
                xtype: 'image',
                src: 'resources/images/cv.png',
                height: 50,
                width: 280
            },{
                title: 'UI Sandbox'
            }],
            lbar:[{
                text: 'Login',
                xtype: 'button',

                handler: function(){
                    cardioCatalogQT.service.UtilityService.http_auth();
                }
            }]
        },{
            title: 'Demographics',
            xtype: 'form',
            width: 200,
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },

            items: [{
                xtype: 'tbspacer',
                height: 25
            },{ // Demographics
                id: 'demographics',
                name: 'demographics',
                items: [{ // Sex
                    xtype: 'combo',
                    itemId: 'sexValue',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select sex',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name: 'female', value: 'f'},
                            {name: 'male', value: 'm'}
                        ]
                    },
                },{
                    xtype: 'tbspacer',
                    height: 50
                }, { // Age
                    xtype: 'combo',
                    itemId: 'ageComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select age that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name: '=', value: 'eq'},
                            {name: '<', value: 'lt'},
                            {name: '<=', value: 'le'},
                            {name: '>', value: 'gt'},
                            {name: '>=', value: 'ge'},
                            {name: 'between', value: 'bt'}
                        ]
                    },

                    listeners: {
                        change: function(combo, value) {
                            // use component query to  toggle the hidden state of upper value
                            if (value === 'bt') {
                                combo.up('form').down('#upperAge').show();
                            } else {
                                combo.up('form').down('#upperAge').hide();
                            }
                        }
                    }
                },{
                    xtype: 'numberfield',
                    name: 'ageValue',
                    itemId: 'ageValue',
                    fieldLabel: 'value of',
                    value: ''
                },{
                    xtype: 'numberfield',
                    itemId: 'upperAge',
                    fieldLabel: 'and',
                    hidden: true
                }]
            }],

            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',

                // process demographics
                handler: function(button) {

                    var payload = Ext.getStore('Payload'),
                        submitted,
                        demo = [],
                        sexValue = button.up('form').down('#sexValue').value,
                        ageComparator = button.up('form').down('#ageComparator').value,
                        ageValue = button.up('form').down('#ageValue').value,
                        upperAge = button.up('form').down('#upperAge').value;


                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object demographics');
                        console.log(sexValue);
                        console.log(ageComparator);
                        console.log(ageValue);
                        console.log(upperAge);
                    }

                    submitted = Ext.getCmp('demographics');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object demographics:');
                        console.log(submitted.items);
                    }

                    demo.push(sexValue);
                    demo.push(ageComparator);
                    demo.push(ageValue);
                    demo.push(upperAge);

                    // insert sex only if exists
                    if (sexValue) {

                        if ((ageComparator === 'bt' &&
                            ageValue &&
                            upperAge) ||

                            (ageComparator !== 'bt' &&
                            ageValue &&
                            !upperAge) ||

                            (ageComparator !== 'bt' &&
                            !ageValue &&
                            !upperAge)) {

                            payload.add({
                                type: 'sex',
                                key: 'sex',
                                comparator: 'eq',
                                value: sexValue
                            });

                            payload.sync();
                        }
                        else {

                            // error conditionals here
                        }
                    }

                    // insert only if exists
                    if (ageValue) {

                        var test_age = ageValue

                        if (ageComparator === 'bt') {

                            if (!upperAge) {
                                alert('Please enter max age to continue')
                            }
                            else {
                                test_age += ',' + upperAge;
                            }
                        }

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('test age: ' + test_age);
                        }

                        if ((ageComparator === 'bt' &&
                            ageValue &&
                            upperAge) ||

                            (!upperAge &&
                            ageComparator !== 'bt' &&
                            ageValue)) {

                            payload.add({
                                type: 'age',
                                key: 'age',
                                comparator: ageComparator,
                                value: test_age
                            });

                            payload.sync();
                        }
                        else{
                            // error conditions here
                        }
                    }

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(demo);
                    }

                }}] // end demographics
        },{
            title: 'Vitals',

            xtype: 'form',
            width: 200,
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },

            items: [{
                xtype: 'tbspacer',
                height: 25
            },{ // Vitals
                id: 'vitals',
                name:'vitals',
                itemId: 'vitals',
                items: [{
                    xtype: 'combo',
                    itemId: 'systolicComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select systolic bp that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name : '=', value: 'eq'},
                            {name : '<', value: 'lt'},
                            {name : '<=', value: 'le'},
                            {name : '>', value: 'gt'},
                            {name : '>=', value: 'ge'}
                        ]
                    }
                },{
                    xtype: 'numberfield',
                    itemId: 'systolicValue',
                    fieldLabel: 'value of',
                    value: ''
                },{
                    xtype: 'tbspacer',
                    height: 25
                },{ // Diastolic
                    xtype: 'combo',
                    itemId: 'diastolicComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select diastolic bp that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name : '=', value: 'eq'},
                            {name : '<', value: 'lt'},
                            {name : '<=', value: 'le'},
                            {name : '>', value: 'gt'},
                            {name : '>=', value: 'ge'}
                        ]
                    }
                },{
                    xtype: 'numberfield',
                    itemId: 'diastolicValue',
                    fieldLabel: 'value of',
                    value: ''
                }]
            }],

            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',

                // get write elements for query to Proxy store
                handler: function(button) {
                    // TODO: cleanup all iccky submitted references !!!!!!!!!!!!

                    var payload = Ext.getStore('Payload'),
                        vitals = [],
                        systolicComparator = button.up('form').down('#systolicComparator').value,
                        systolicValue = button.up('form').down('#systolicValue').value,
                        diastolicComparator = button.up('form').down('#diastolicComparator').value,
                        diastolicValue = button.up('form').down('#diastolicValue').value;

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object vitals');
                        console.log(systolicComparator);
                        console.log(systolicValue);
                        console.log(diastolicComparator);
                        console.log(diastolicValue);
                    }

                    vitals.push(systolicComparator);
                    vitals.push(systolicValue);
                    vitals.push(diastolicComparator);
                    vitals.push(diastolicValue);

                    // insert only if exists
                    if (systolicValue) {

                        payload.add({
                            type: 'blood_pressure_systolic',
                            key: 'blood_pressure_systolic',
                            comparator: systolicComparator,
                            value: systolicValue
                        });

                        payload.sync();
                    }

                    // insert only if exists
                    if (diastolicValue) {

                        payload.add({
                            type: 'blood_pressure_diastolic',
                            key: 'blood_pressure_diastolic',
                            comparator: diastolicComparator,
                            value: diastolicValue
                        });

                        payload.sync();
                    }

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(vitals);
                    }

                }}] // end vitals
        },{
            title: 'Labs', // TODO: test use of regions
            xtype: 'form',
            width: 200,
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },

            items: [{ // LABS
                        id: 'labs',
                        name:'labs',
                        items: [{
                            xtype: 'combo',
                            flex : 1,
                            width: 400,
                            name: 'LabCode',
                            queryMode: 'local',
                            editable: false,
                            triggerAction: 'all',
                            forceSelection: true,
                            loading: true,
                            fieldLabel: 'Select lab type',
                            displayField: 'description',
                            valueField: 'code',
                            value: '13457-7',
                            store: 'Labs'
                        },
                        {
                            xtype: 'combo',
                            flex : 1,
                            name: 'LabComparator',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'that is',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name : '=', value: 'eq'},
                                    {name : '<', value: 'lt'},
                                    {name : '<=', value: 'le'},
                                    {name : '>', value: 'gt'},
                                    {name : '>=', value: 'ge'},
                                    {name : 'between', value: 'bt'}
                                ]
                            },
                            listeners: {
                                change: function(combo, value) {
                                    // use component query to  toggle the hidden state of upper value
                                    if (value === 'bt') {
                                        combo.up('form').down('#upperLab').show();
                                    } else {
                                        combo.up('form').down('#upperLab').hide();
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'labValue',
                            fieldLabel: 'Min value',
                            value: ''
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'upperLab',
                            fieldLabel: 'and',
                            hidden: true
                        }]
                    }],

            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',

                // get write elements for query to Proxy store
                handler: function() {

                    var payload = Ext.getStore('Payload'),
                        submitted,
                        lab = [];

                    // begin test lab
                    submitted = Ext.getCmp('labs');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object labs');
                        console.log(submitted.items)
                    }

                    Ext.Array.each(submitted, function (item) {
                        lab.push(item.items.items[0].lastValue); // type
                        lab.push(item.items.items[1].lastValue); // comparator
                        lab.push(item.items.items[3].lastValue); // comparator
                        lab.push(item.items.items[4].lastValue); // comparator


                        // only insert if exists
                        if (item.items.items[2].lastValue) {
                            payload.add({
                                type: 'lab',
                                key: item.items.items[0].lastValue,
                                value: item.items.items[3].lastValue,
                                comparator: item.items.items[1].lastValue
                            })
                        }
                    }); // each()

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('labs:');
                        console.log(lab);
                    }

                    payload.sync();
                    // end test lab
                }}]

        },{
            title: 'Diagnosis',
            xtype: 'form',
            width: 600,

            items: [{ //Dx
                width: 300,
                xtype: 'multiselector',
                title: 'Selected Dx',
                id: 'diagnosis',
                name:'diagnosis',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Dx selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'description',
                    store: 'Diagnoses',

                    search: function (text) {

                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            }],

            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',

                // get write elements for query to Proxy store
                handler: function() {

                    var payload = Ext.getStore('Payload'),
                        submitted,
                        dx = [];

                    // begin test Dx
                    submitted = Ext.getCmp('diagnosis');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show submitted Dx:');
                        console.log(submitted);
                    }

                    Ext.Array.each(submitted.store.data.items, function (item) {
                        dx.push(item.data.code,item.data.description);

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(item)
                        }

                        // TODO: ensure record does not already exist
                        payload.add({
                            type: 'dx',
                            key: 'dx_code',
                            comparator: 'eq',
                            value: item.data.code,
                            description: item.data.description
                        });

                        payload.sync();

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('dx');
                            console.log(dx);
                            console.log(payload);
                        }

                    }); // each()
                    // end test Dx
                }

            }]

        },{

            title: 'Medications',
            xtype: 'form',

            items: [{ //Rx
                width: 300,
                xtype: 'multiselector',
                title: 'Selected Rx',
                id: 'medication',
                name:'medication',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Rx selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'description',
                    store: 'Medications',

                    search: function (text) {

                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            }],

            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',

                // get write elements for query to Proxy store
                handler: function() {

                    var payload = Ext.getStore('Payload'),
                        submitted,
                        rx = [];

                    // begin test Dx
                    submitted = Ext.getCmp('medication');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show submitted Rx:');
                        console.log(submitted);
                    }

                    Ext.Array.each(submitted.store.data.items, function (item) {
                        rx.push(item.data.code,item.data.description);

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(item)
                        }

                        // TODO: ensure record does not already exist
                        payload.add({
                            type: 'rx',
                            key: 'rx_code',
                            comparator: 'eq',
                            value: item.data.code,
                            description: item.data.description
                        });

                        payload.sync();

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('rx');
                            console.log(rx);
                            console.log(payload);
                        }

                    }); // each()
                    // end test Rx
                }

            }]

        },{
            title: 'Procedure',
            xtype: 'form',

            items: [{ //Px
                width: 500,
                xtype: 'multiselector',
                title: 'Selected Px',
                id: 'procedure',
                name:'procedure',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Px selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'description',
                    store: 'Procedures',

                    search: function (text) {

                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            }],

            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',

                // get write elements for query to Proxy store
                handler: function() {

                    var payload = Ext.getStore('Payload'),
                        submitted,
                        px = [];

                    // begin test Px
                    submitted = Ext.getCmp('procedure');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show submitted Px:');
                        console.log(submitted);
                    }

                    Ext.Array.each(submitted.store.data.items, function (item) {
                        px.push(item.data.code,item.data.description);

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(item)
                        }

                        // TODO: ensure record does not already exist
                        payload.add({
                            type: 'px',
                            key: 'px_code',
                            comparator: 'eq',
                            value: item.data.code,
                            description: item.data.description
                        });

                        payload.sync();

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('px');
                            console.log(px);
                            console.log(payload);
                        }

                    }); // each()
                    // end test Px
                }

            }]
        }/*,{


            text: 'Execute Query',
            handler: function() {

                var auth = sessionStorage.sessionToken + ':unknown',
                    hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(auth),
                    panel = Ext.getCmp('Ajax'),
                    url = cardioCatalogQT.service.UtilityService.url_request(),
                    json = [],
                    records = [],
                    store = Ext.create('Ext.data.Store',{
                        fields: [
                            'attribute',
                            'sid',
                            'value',
                            'N',
                            'source'
                        ],
                        data: records,
                        paging: false
                    });


                var url = cardioCatalogQT.service.UtilityService.url(payload);

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('call to make url: ' + url);
                }

                cardioCatalogQT.service.UtilityService.destroy_cmp();

                panel.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading...'
                });

                // send auth header before Ajax request to disable auth form
                Ext.Ajax.on('beforerequest', (function(klass, request) {
                    if (request.failure) { // already have auth token: do nothing
                        return null;
                    }
                    else { // send auth token
                        return request.headers.Authorization = hash;
                    }
                }), this);

                Ext.Ajax.request({
                    cors: true,
                    url: url,
                    useDefaultXhrHeader: false,
                    headers: {
                        'Accept': 'application/json'
                    },
                    disableCaching: false,
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

                        // render template
                        cardioCatalogQT.service.UtilityService.template(panel, store);
                    }
                });
            }}*/
       // ]
    //},

    ]
});

