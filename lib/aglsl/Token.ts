import Destination				= require("awayjs-stagegl/lib/aglsl/Destination");

class Token
{
	public dest:Destination = new Destination();
	public opcode:number = 0;
	public a:Destination = new Destination();
	public b:Destination = new Destination();

	constructor()
	{
	}
}

export = Token;