import { RulesInterface } from '../../interface/listing/rules.interface';

export class Rules implements RulesInterface {
  constructor(
    public smoking = false,
    public pets = false,
    public drugs = false,
    public drinking = false,
    public dogOk = false,
    public catOk = false,
    public otherPetOk = false,
    public couplesOk = false
  ) { }
}
