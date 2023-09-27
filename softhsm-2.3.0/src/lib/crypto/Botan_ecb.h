/*
* ECB Mode
* (C) 1999-2009,2013 Jack Lloyd
* (C) 2016 Daniel Neus, Rohde & Schwarz Cybersecurity
*
* Botan is released under the Simplified BSD License (see license.txt)
*/

#ifndef BOTAN_MODE_ECB_H__
#define BOTAN_MODE_ECB_H__

#include <botan/version.h>
#if BOTAN_VERSION_CODE >= BOTAN_VERSION_CODE_FOR(2,0,0)
// ECB cipher mode was dropped in Botan 2.0.0
// so including this code in SoftHSM for continued support
// for e.g. CKA_VALUE_CHECK

#include <botan/cipher_mode.h>
#include <botan/block_cipher.h>
#include <botan/mode_pad.h>

namespace Botan {

/**
* ECB mode
*/
class BOTAN_DLL ECB_Mode : public Cipher_Mode
   {
   public:
      std::string name() const override;

      size_t update_granularity() const override;

      Key_Length_Specification key_spec() const override;

      size_t default_nonce_length() const override;

      bool valid_nonce_length(size_t n) const override;

      void clear() override;

      void reset() override;

   protected:
      ECB_Mode(BlockCipher* cipher, BlockCipherModePaddingMethod* padding);

      const BlockCipher& cipher() const { return *m_cipher; }

      const BlockCipherModePaddingMethod& padding() const { return *m_padding; }

   private:
      void start_msg(const byte nonce[], size_t nonce_len) override;
      void key_schedule(const byte key[], size_t length) override;

      std::unique_ptr<BlockCipher> m_cipher;
      std::unique_ptr<BlockCipherModePaddingMethod> m_padding;
   };

/**
* ECB Encryption
*/
class BOTAN_DLL ECB_Encryption final : public ECB_Mode
   {
   public:
      /**
      * @param cipher block cipher to use
      * @param padding padding method to use
      */
      ECB_Encryption(BlockCipher* cipher, BlockCipherModePaddingMethod* padding) :
         ECB_Mode(cipher, padding) {}

      size_t process(uint8_t buf[], size_t size) override;

      void finish(secure_vector<byte>& final_block, size_t offset = 0) override;

      size_t output_length(size_t input_length) const override;

      size_t minimum_final_size() const override;
   };

/**
* ECB Decryption
*/
class BOTAN_DLL ECB_Decryption final : public ECB_Mode
   {
   public:
      /**
      * @param cipher block cipher to use
      * @param padding padding method to use
      */
      ECB_Decryption(BlockCipher* cipher, BlockCipherModePaddingMethod* padding) :
         ECB_Mode(cipher, padding) {}

      size_t process(uint8_t buf[], size_t size) override;

      void finish(secure_vector<byte>& final_block, size_t offset = 0) override;

      size_t output_length(size_t input_length) const override;

      size_t minimum_final_size() const override;
   };

}

#endif

#endif
