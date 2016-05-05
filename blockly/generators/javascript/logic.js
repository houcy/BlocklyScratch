/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.JavaScript.logic');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['control_if'] = function(block) {
  // If/elseif/else condition.
  if(Blockspace.downloadingCode){
    var n = 0;
    code = "";
    for (; n <= block.elseifCount_; n++) {
      code += Blockly.JavaScript.statementToCode(block, 'DO' + n);
    }
    if (block.elseCount_) {
      code += Blockly.JavaScript.statementToCode(block, 'ELSE');
    }
    return code;
  }
  else {
    var n = 0;
    var argument = Blockly.JavaScript.valueToCode(block, 'IF' + n,
        Blockly.JavaScript.ORDER_NONE) || 'false';
    var branch = Blockly.JavaScript.statementToCode(block, 'DO' + n);
    var code = 'if (' + argument + ') {\n' + branch + '}';
    for (n = 1; n <= block.elseifCount_; n++) {
      argument = Blockly.JavaScript.valueToCode(block, 'IF' + n,
          Blockly.JavaScript.ORDER_NONE) || 'false';
      branch = Blockly.JavaScript.statementToCode(block, 'DO' + n);
      code += ' else if (' + argument + ') {\n' + branch + '}';
    }
    if (block.elseCount_) {
      branch = Blockly.JavaScript.statementToCode(block, 'ELSE');
      code += ' else {\n' + branch + '}';
    }
    return code + '\n';
  }
  return "";
};

Blockly.JavaScript['logic_compare'] = function(block) {
  // Comparison operator.
  if(!Blockspace.downloadingCode){
    var OPERATORS = {
      'EQ': '==',
      'NEQ': '!=',
      'LT': '<',
      'LTE': '<=',
      'GT': '>',
      'GTE': '>='
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = (operator == '==' || operator == '!=') ?
        Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  }
  return "";
};

Blockly.JavaScript['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  if(!Blockspace.downloadingCode){
    var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
    var order = (operator == '&&') ? Blockly.JavaScript.ORDER_LOGICAL_AND :
        Blockly.JavaScript.ORDER_LOGICAL_OR;
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order);
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order);
    if (!argument0 && !argument1) {
      // If there are no arguments, then the return value is false.
      argument0 = 'false';
      argument1 = 'false';
    } else {
      // Single missing arguments have no effect on the return value.
      var defaultArgument = (operator == '&&') ? 'true' : 'false';
      if (!argument0) {
        argument0 = defaultArgument;
      }
      if (!argument1) {
        argument1 = defaultArgument;
      }
    }
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  }
  return "";
};

Blockly.JavaScript['logic_negate'] = function(block) {
  // Negation.
  if(!Blockspace.downloadingCode){
    var order = Blockly.JavaScript.ORDER_LOGICAL_NOT;
    var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) ||
        'true';
    var code = '!' + argument0;
    return [code, order];
  }
  return "";
};

Blockly.JavaScript['logic_boolean'] = function(block) {
  // Boolean values true and false.
  if(!Blockspace.downloadingCode){
    var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  }
  return "";
};

Blockly.JavaScript['logic_null'] = function(block) {
  // Null data type.
  if(!Blockspace.downloadingCode){
    return ['null', Blockly.JavaScript.ORDER_ATOMIC];
  }
  return "";
};

Blockly.JavaScript['logic_ternary'] = function(block) {
  // Ternary operator.
  if(!Blockspace.downloadingCode){
    var value_if = Blockly.JavaScript.valueToCode(block, 'IF',
        Blockly.JavaScript.ORDER_CONDITIONAL) || 'false';
    var value_then = Blockly.JavaScript.valueToCode(block, 'THEN',
        Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';
    var value_else = Blockly.JavaScript.valueToCode(block, 'ELSE',
        Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';
    var code = value_if + ' ? ' + value_then + ' : ' + value_else;
    return [code, Blockly.JavaScript.ORDER_CONDITIONAL];
  }
  return "";
};
