import React from 'react';

export default () => (
  <div
    style={{ display: 'none' }}
    dangerouslySetInnerHTML={{ __html: `
  <xml id="toolbox-fff">
    <category name="Events" secondaryColour="0">
      <block type="event_whenflagclicked"></block>
      <block type="event_whenbroadcastreceived">
        <value name="CHOICE">
          <shadow type="dropdown_whenbroadcast">
            <field name="CHOICE">blue</field>
          </shadow>
        </value>
      </block>
      <block type="event_broadcast">
        <value name="CHOICE">
          <shadow type="dropdown_broadcast">
            <field name="CHOICE">blue</field>
          </shadow>
        </value>
      </block>
    </category>

    <category name="Control" secondaryColour="0">
      <block type="control_forever"></block>
      <block type="control_repeat">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">4</field>
          </shadow>
        </value>
      </block>
      <block type="control_stop"></block>
      <block type="control_wait">
        <value name="DURATION">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </category>

    <category name="Wedo" secondaryColour="0">
        <block type="wedo_setcolor">
          <value name="CHOICE">
            <shadow type="dropdown_wedo_setcolor">
              <field name="CHOICE">mystery</field>
            </shadow>
          </value>
        </block>
        <block type="wedo_motorclockwise">
            <value name="DURATION">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
        </block>
        <block type="wedo_motorcounterclockwise">
            <value name="DURATION">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
        </block>
        <block type="wedo_motorspeed">
          <value name="CHOICE">
            <shadow type="dropdown_wedo_motorspeed">
              <field name="CHOICE">fast</field>
            </shadow>
          </value>
        </block>
        <block type="wedo_whentilt">
          <value name="CHOICE">
            <shadow type="dropdown_wedo_whentilt">
              <field name="CHOICE">forward</field>
            </shadow>
          </value>
        </block>
        <block type="wedo_whendistanceclose"></block>
    </category>
  </xml>`}}
  />
);
