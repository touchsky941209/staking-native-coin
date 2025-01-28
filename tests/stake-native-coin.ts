import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StakeNativeCoin } from "../target/types/stake_native_coin";
import { createAccount, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, metadata } from "@solana/spl-token";
// import { Keypair, PublicKey } from "@solana/web3.js"
import { Keypair, PublicKey } from "@solana/web3.js"
import {
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
// import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";


describe("stake-native-coin", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);
  const program = anchor.workspace.StakeNativeCoin as Program<StakeNativeCoin>;
  const mintToken = anchor.web3.Keypair.generate()

  const tokenAccount = anchor.utils.token.associatedAddress({ mint: mintToken.publicKey, owner: provider.publicKey })

  const umi = createUmi("http://127.0.0.1:8899")
  .use(walletAdapterIdentity(provider.wallet))
  .use(mplTokenMetadata());

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Create token!", async () => {

    console.log("mint account => ", mintToken.publicKey.toBase58())
    console.log("token account => ", tokenAccount.toBase58())

    try {
      const tx = await program.methods.createToken(9, new anchor.BN(10 ** 9 * 100))
        .accounts({
          mintToken: mintToken.publicKey,
          tokenAccount: tokenAccount,
          associateTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([mintToken])
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (error) {
      console.log(error)
    }
  });

  it("set meatadata!", async () => {
    let metadataData: any = {
      name: "quensera",
      symbol: "quensera_symbol",
      uri: "",
      sellerFeeBasisPoints: 500,
      suply: 100000

    }
    const metadataProgram = MPL_TOKEN_METADATA_PROGRAM_ID

    let metadataAccount = findMetadataPda(umi, {
      mint: publicKey(mintToken.publicKey),
    })[0];

    let masterEditionAccount = findMasterEditionPda(umi, {
      mint: publicKey(mintToken.publicKey),
    })[0];

    let editionAccount = Keypair.generate()

    console.log("Program ID : ", anchor.web3.SystemProgram)
    console.log("Token Program ID : ", anchor.utils.token.TOKEN_PROGRAM_ID)
    try {
      const tx = await program.methods.setTokenMetadata(metadataData)
        .accounts({
          mintToken: mintToken.publicKey,
          signer: provider.wallet.publicKey,
          metadataAccount: metadataAccount,
          masterAccount: masterEditionAccount,
          editionAccount: editionAccount.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associateTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          metadataProgram: metadataProgram,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        })
        .signers([mintToken])
        .rpc();
    } catch (err) {
      console.log("err =>", err)
    }
  })


  // it("Token transfer", async () => {

  //   let reciever = anchor.web3.Keypair.generate()
  //   const signature = await provider.connection.requestAirdrop(reciever.publicKey, anchor.web3.LAMPORTS_PER_SOL)
  //   await provider.connection.confirmTransaction(signature)
  //   let recieverTokenAccountKeypair = anchor.web3.Keypair.generate()
  //   await createAccount(provider.connection, reciever, mintToken.publicKey, reciever.publicKey, recieverTokenAccountKeypair);

  //   try {
  //     const tx = await program.methods.tranfserToken(new anchor.BN(10 ** 9 * 90))
  //       .accounts({
  //         mintToken: mintToken.publicKey,
  //         fromAccount: tokenAccount,
  //         toAccount: recieverTokenAccountKeypair.publicKey,
  //         associateTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
  //       })
  //       .signers([])
  //       .rpc()

  //     console.log("Your transaction signature", tx);
  //   } catch (error) {
  //     console.log(error)
  //   }

  // })


  // it("Set Authority token!", async () => {
  //   let new_signer = anchor.web3.Keypair.generate()
  //   try {
  //     const tx = await program.methods.setAuthorityToken(0)
  //       .accounts({
  //         mintToken: mintToken.publicKey,
  //         tokenAccount: tokenAccount,
  //         newSigner: new_signer.publicKey,
  //       })
  //       .signers([new_signer])
  //       .rpc();
  //     console.log("Your transaction signature", tx);
  //   } catch (e) {
  //     console.log(e)
  //   }
  // });

  // it("Freeze token!", async () => {
  //   const tx = await program.methods.freezeToken()
  //     .accounts({
  //       mintToken: mintToken.publicKey,
  //       tokenAccount,
  //     })
  //     .signers([])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Unfreeze token!", async () => {
  //   const tx = await program.methods.unFreezeToken()
  //     .accounts({
  //       mintToken: mintToken.publicKey,
  //       tokenAccount,
  //     })
  //     .signers([])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Burn token!", async () => {
  //   try {
  //     const tx = await program.methods.burnToken(new anchor.BN(10 ** 9 * 10))
  //       .accounts({
  //         mintToken: mintToken.publicKey,
  //         tokenAccount,
  //       })
  //       .signers([])
  //       .rpc();
  //     console.log("Your transaction signature", tx);
  //   } catch (error) {
  //     console.log(error)
  //   }

  // });

  // it("Close token!", async () => {
  //   const tx = await program.methods.closeToken()
  //     .accounts({
  //       mintToken: mintToken.publicKey,
  //       tokenAccount,
  //     })
  //     .signers([])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });
});
